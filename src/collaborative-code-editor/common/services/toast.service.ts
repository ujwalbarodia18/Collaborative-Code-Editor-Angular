import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ToasterService {
  constructor(private toastr: ToastrService) {}

  defaultConfig: Partial<IndividualConfig<any>> = {
    newestOnTop: true,
    maxOpened: 5,
  } as any

  success(message: string, title = 'Success') {
    this.toastr.success(message, title);
  }

  error(message: string, title = 'Error') {
    this.toastr.error(message, title, this.defaultConfig);
  }

  info(message: string, title = 'Info') {
    this.toastr.info(message, title);
  }

  warning(message: string, title = 'Warning') {
    this.toastr.warning(message, title);
  }
}
