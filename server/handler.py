import requests
import json
import hashlib
import base64
import uuid
from datetime import datetime
from bitstring import BitArray
import xml.etree.ElementTree as ET
url = 'http://thermadatawifi.trafficmanager.net/externalapp.asmx'
headers = {'content-type': 'application/soap+xml'}


def lambda_handler(event, context):
    action = event['action']
    payload = event['payload']

    client_guid = payload.get('client_guid', None)
    server_guid = payload.get('server_guid', None)

    try:
        res = None
        if action == 'create_connection':
            res = do_create_connection(client_guid)
        elif action == 'list_devices':
            res = do_list_devices(client_guid, server_guid)
        elif action == 'read_access':
            serial = payload['serial']
            read_key = payload['read_key']
            res = do_get_read_access(
                client_guid, server_guid, serial, read_key)
        elif action == 'get_packets':
            res = do_get_packets(client_guid, server_guid)
        return res
    except Exception as e:
        return {'action': 'error', 'payload': str(e)}


def do_create_connection(guid):
    method = 'CreateNewConnection'
    body = soapify(method, client_guid=guid)

    res_body = post(body)

    server_guid = res_body[0][0].text
    payload = {'server_guid': server_guid, 'client_guid': guid}
    return {'action': 'ok', 'payload': payload}


def do_list_devices(client_guid, server_guid):
    method = 'GetMyConnectionsEx2'
    body = soapify(method,
                   client_guid=client_guid,
                   server_guid=server_guid, authenticate_tag_name='authentication')

    res_body = post(body)

    devices = res_body[0][0]
    payload = {'devices': []}
    for device in devices:
        device_dict = dictify_xml(device)
        payload['devices'].append(device_dict)

    return {'action': 'ok', 'payload': payload}


def do_get_read_access(client_guid, server_guid, serial, read_key):
    method = 'RequestReadAccessToInstrument'
    data = [
        ('serialNumber', serial),
        ('readKey', read_key)
    ]

    body = soapify(method, client_guid=client_guid,
                   server_guid=server_guid, data=data)

    res_body = post(body)

    resp = res_body[0][0]

    return {'action': 'ok', 'payload': bool(resp.text)}

def get_sensor_readings(envelope_node):
  sensor_1_tag = 'XmlSerializiseSensor1LastReading'
  sensor_2_tag = 'XmlSerializiseSensor2LastReading'

  def get_sensor_reading(tag):
    reading = find_data_point(tag)
    bs = base64.b64decode(reading.text)
    temperature = bs[:3]
    time_stamp = bs[3:]
    value = get_value(temperature)
    units = get_units(temperature)

def get_datetime_from_saved_reading(bs):
  """
  input: 4 bytes from saved reading
  """
  little_e = bs[::-1]
  bits = BitArray(little_e)

  hour = bits[0:5].uint
  minute = bits[5:11].uint
  second = bits[11:17].uint
  year = bits[17:23].uint + 2015
  month = bits[23:27].uint
  day = bits[27:32].uint

  return datetime(year=year, month=month, day=day, hour=hour, minute=minute, second=second)



def parse_packets(packets):
    print(list(packets))

def get_units(temp_bytes):
  """
  Takes in a 3-byte TU

  returns (sensor_index, 'c' | 'f')
  """
  unit_code = temp_bytes[2] >> 4
  if unit_code == 1:
    return (1, 'c')
  elif unit_code == 2:
    return (1, 'f')
  elif unit_code == 9:
    return (2, 'c')
  elif unit_code == 10:
    return (2, 'f')
  else:
    return (None, 'x')

def get_value(temp_bytes):
  mask = 0b0001111
  masked = temp_bytes[:2] + (temp_bytes[2] & mask).to_bytes(1, byteorder='little')
  altered_value = int.from_bytes(masked, byteorder='little')
  return (altered_value / 300) - 400

def call_server(
        client_guid,
        server_guid,
        method,
        data=[],
        authenticate_tag_name='authenticate',
        payloader=lambda body_node: body_node[0][0].text):
    body = soapify(
        method,
        client_guid=client_guid,
        server_guid=server_guid,
        data=data,
        authenticate_tag_name=authenticate_tag_name
    )
    response_body = post(body)

    return {'action': 'ok', 'payload': payloader(response_body)}


def do_get_packets(client_guid, server_guid):
    method = 'GetPackets2'
    data = [
        ('maxConnection', 30)
    ]
    body = soapify(method, client_guid=client_guid,
                   server_guid=server_guid, data=data)
    res_body = post(body)

    resp = res_body[0][0]
    err = resp[0]
    packets = resp[1]

    print(err)
    print(packets)

    return {'action': 'ok', 'payload': parse_packets(packets)}


def do_get_cache(client_guid, server_guid, serial):
    return call_server(
        method='GetCachedInstrumentInfo',
        client_guid=client_guid,
        server_guid=server_guid,
        data=[('serialNumber', serial)],
        authenticate_tag_name='authenticate'
    )


def post(body):
    print('SENDING:')
    print(body)

    res = requests.post(url, headers=headers, data=body)

    print('RESPONSE:')
    print(res.text)

    if res.status_code > 400:
        raise Exception(res.text)
    else:
        return get_body(ET.fromstring(res.text))


def get_body(xml_node):
    print(xml_node)
    return xml_node.find('{http://www.w3.org/2003/05/soap-envelope}Body')


data_point_ns = 'http://www.eti.co.uk/Protocols/ProtocolTestSupport/V1'
def nsify(tag_name):
  return '{{{0}}}{1}'.format(data_point_ns, tag_name)

def get_sub_body(body, tag):
    return body.iter(nsify(tag))

def find_data_point(parent_node, tag):
  return parent_node.find(nsify(tag))


def strip_ns(tag_name):
    return tag_name.split('}')[1]


def dictify_xml(node):
    return {strip_ns(x.tag): x.text for x in node}


def soapify(method, client_guid, data=[], server_guid=None, authenticate_tag_name='authenticate'):
    """
    method: str

    data: [key, value][]

    server_guid?: str
    """
    xml = ET.fromstring("""<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
  </soap12:Body>
</soap12:Envelope>""")

    bodyNode = get_body(xml)
    # make body
    methodNode = ET.SubElement(bodyNode, method)
    methodNode.set(
        'xmlns',
        "http://www.eti.co.uk/Protocols/ProtocolTestSupport/V1"
    )

    connectionID = ET.SubElement(methodNode, 'connectionID')
    connectionID.text = client_guid

    for (key, value) in data:
        datum = ET.SubElement(methodNode, key)
        datum.text = str(value)

    if server_guid is not None:
        # do the auth
        data_values = [d[1] for d in data]
        auth_b64 = get_auth_hash(client_guid, server_guid, data_values)
        auth_node = ET.SubElement(methodNode, authenticate_tag_name)
        auth_node.text = auth_b64

    return ET.tostring(xml)


def get_auth_hash(client_guid, server_guid, data):
    def uuid_str_to_bytes(uuid_str):
        return uuid.UUID(uuid_str).bytes_le
    c = uuid_str_to_bytes(client_guid)
    s = uuid_str_to_bytes(server_guid)

    hasher = hashlib.sha512()
    hasher.update(c)
    hasher.update(s)

    for datum in data:
        if type(datum) is str:
            bs = datum.encode('utf-8')
        elif type(datum) is int:
            bs = datum.to_bytes(4, byteorder='little')
        elif type(datum) is bool:
            bs = b'\x01' if datum else b'\x00'

        hasher.update(bs)

    return base64.b64encode(hasher.digest()).decode('utf-8')
