import { AbstractControl } from "@angular/forms"

export class SharedLib {
  castToObject = function(inpVar: any, outVar: any): any {
    Object.keys(inpVar).forEach(key => {
      if (outVar.hasOwnProperty(key)) {
        outVar[key] = inpVar[key]
      }
    })
    return outVar
  }

  formatDate(date) {
    if (date) {
      const d = new Date(date)
      const year = d.getFullYear()
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()

      if (month.length < 2) {
        month = '0' + month
      }
      if (day.length < 2) {
        day = '0' + day
      }

      return [year, month, day].join('-')
    }
  }

  formatIntDate(date) {
    try {
      if (date) {
        const d = new Date(date)
        const year = d.getFullYear()

        let month = '' + (d.getMonth() + 1)
        let day = '' + d.getDate()

        if (month.length < 2) {
          month = '0' + month
        }
        if (day.length < 2) {
          day = '0' + day
        }

        return [year, month, day].join('')
      }
    } catch (error) {
      console.error(
        'unable to process "formatIntDate" for the value [' + date + ']'
      )
    }
  }

  getUIDateInDateformat(date) {
    try {
      if (date) {
        const d = date.split('-')
        const month = d[1]
        const day = d[0]
        const year = d[2]

        return new Date(year, month, day)
      }
    } catch (error) {
      console.error(
        'unable to process "getUIDateInDateformat" for the value [' + date + ']'
      )
    }
  }

  formatServerDateToUIDate(date) {
    try {
      if (date) {
        const d = date.split('-')
        const month = d[1]
        const day = d[0]
        const year = d[2]

        return new Date(year, month, day)
      }
    } catch (error) {
      console.error(
        'unable to process "formatServerDateToUIDate" for the value [' +
          date +
          ']'
      )
    }
  }

  formatConvertToUIDate(date) {
    try {
      if (date) {
        return new Date(date)
      }
    } catch (error) {
      console.error(
        'unable to process "formatServerDateToUIDate" for the value [' +
          date +
          ']'
      )
    }
  }

  formatToUIDate(date) {
    try {
      if (date) {
        const d = new Date(date)
        const year = d.getFullYear()
        let month = '' + (d.getMonth() + 1)
        let day = '' + d.getDate()

        if (month.length < 2) {
          month = '0' + month
        }
        if (day.length < 2) {
          day = '0' + day
        }

        return [day, month, year].join('/')
      }
    } catch (error) {
      console.error(
        'unable to process "formatToUIDate" for the value [' + date + ']'
      )
    }
  }

  validateDate(date) {
    if (date) {
      try {
        const d = new Date(
          date.split('/')[1] +
            '/' +
            date.split('/')[0] +
            '/' +
            date.split('/')[2]
        )
        if (d.toString() !== 'Invalid Date' && date.length === 10) {
          let month = '' + (d.getMonth() + 1)
          let day = '' + d.getDate()
          const year = d.getFullYear()

          if (month.length < 2) {
            month = '0' + month
          }
          if (day.length < 2) {
            day = '0' + day
          }

          return [day, month, year].join('/')
        } else {
          return ''
        }
      } catch (ex) {
        return ''
      }
    }
  }

  calculateAgeAsOn(born, now): number {
    const birthday = new Date(
      now.getFullYear(),
      born.getMonth(),
      born.getDate()
    )
    if (now >= birthday) {
      return now.getFullYear() - born.getFullYear()
    } else {
      return now.getFullYear() - born.getFullYear() - 1
    }
  }

  calculateAge(born): number {
    return this.calculateAgeAsOn(born, new Date())
  }

  // createFormData(model: any, form: FormData = null, namespace = ''): FormData {
  //   const formData = form || new FormData();
  //   for (const propertyName in model) {
  //     if (!model.hasOwnProperty(propertyName) || (!model[propertyName] && model[propertyName] !== 0)) { continue; }
  //     const formKey = namespace ? `${namespace}[${propertyName}]` : propertyName;
  //     if (model[propertyName] instanceof Date) {
  //       formData.append(formKey, model[propertyName].toISOString());
  //     } else if (model[propertyName] instanceof Array) {
  //       model[propertyName].forEach((element, index) => {
  //         const tempFormKey = `${formKey}[${index}]`;
  //         this.createFormData(element, formData, tempFormKey);
  //       });
  //     } else if (typeof model[propertyName] === 'object' && !(model[propertyName] instanceof File)) {
  //       this.createFormData(model[propertyName], formData, formKey);
  //     } else {
  //       formData.append(formKey, model[propertyName].toString());
  //     }
  //   }
  //   return formData;
  // }

  createFormData(
    object: Object,
    form?: FormData,
    namespace?: string
  ): FormData {
    const formData = form || new FormData()
    for (const property in object) {
      if (
        !object.hasOwnProperty(property) ||
        (!object[property] && object[property] !== 0)
      ) {
        continue
      }
      const formKey = namespace ? `${namespace}[${property}]` : property
      if (object[property] instanceof Date) {
        formData.append(formKey, object[property].toISOString())
      } else if (
        typeof object[property] === 'object' &&
        !(object[property] instanceof File)
      ) {
        this.createFormData(object[property], formData, formKey)
      } else {
        formData.append(formKey, object[property])
      }
    }
    return formData
  }

  formatPhoneNumber(phonenumber) {
    // const phonenumber2 = ('' + phonenumber).replace(/^\+[1]{1}/, '').replace(/\D/g, '').replace(/^[1]{1}/, '');
    // const result = phonenumber2.match(/^(\d{3})(\d{3})(\d{4})$/);
    // return (!result) ? null : result[1] + result[2] + result[3];
    return phonenumber
  }

  checkNullorUndefined(data) {
    if (data === null || data === undefined) {
        return true;
    } else {
        return false;
    }
  }

}

export function rmBetweenWhiteSpaces(control: AbstractControl) {
  if (control.dirty && control.value) {
    if (!control.value.replace(/\s/g, '').length) {
      control.setValue('');
    }
    else {
      if ((control.value as string).indexOf(' ') >= 0) {
        control.setValue(control.value.replace(/\s/g, ''));
        //return  { cannotContainSpace: true }
      }
      else if ((control.value as string).indexOf('  ') >= 0) {
        let trimSpace = control.value.replace(/\s+/g, ' ');
        control.setValue(trimSpace.trim());
      }
    }

    return control.value.replace(/\s/g, '').length == 0 ? { 'whitespace': true } : null

  }

  return null;

}

export function removeWhiteSpaces(control: AbstractControl) {
  if (control.dirty && control.value && !control.value.replace(/\s/g, '').length) {
    control.setValue('');
    return control.value.replace(/\s/g, '').length == 0 ? { 'whitespace': true } : null
  }
  return null;
}

export function removeSpacesInText(control: AbstractControl) {
  // if (control.dirty && control.value && !control.value.replace(/\s/g, '').length) {
  //   control.setValue('');
  //   return control.value.replace(/\s/g, '').length == 0 ? { 'whitespace': true } : null
  // }
  if (control.dirty && control.value && (control.value as string).match(/\s{2,}/)) {
    let trimSpace = control.value.replace(/\s{2,}/g, ' ');
    control.setValue(trimSpace);
  }
  return null;
}
