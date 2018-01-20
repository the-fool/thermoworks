import {
  Component,
  OnInit,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'thermo-connect-form',
  templateUrl: 'connect-form.template.html'
})

export class ConnectFormComponent implements OnInit {
  form: FormGroup;
  constructor(public fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      serial: ['', Validators.required],
      readKey: ['', Validators.required]
    });
  }

  onSubmit() {

  }
}
