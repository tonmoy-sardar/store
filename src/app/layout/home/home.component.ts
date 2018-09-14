import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { LoginComponent } from '../../core/component/login/login.component';
import { GeneralService } from '../../core/services/general.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private fragment: string;
  isLoggedin: boolean;
  user_name: string;
  writeUsForm: FormGroup;
  
  words = [
    ['EARN'],
    ['EASY'],
    ['RICH'],
    ['COOL'],
    ['DEAL'],
    ['GAIN'],
    ['GOAL'],
    ['USER'],
    ['PLAN'],
    ['IDEA'],
    ['SAFE'],
    ['MAKE'],
    ['SELL'],
    ['HIGH'],
    ['SHOP'],
    ['MEET'],
    ['MAIN'],
    ['MOTO'],
    ['BEST'],
    ['FIND']
  ];

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private generalService: GeneralService,
  ) {
    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        if (tree.fragment) {
          const element = document.querySelector("#" + tree.fragment);
          if (element) { element.scrollIntoView(true); }
        }
      }
    });
   }

  ngOnInit() {
    if (sessionStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
      this.user_name = sessionStorage.getItem('logedUserUserName')
    }

    this.slotMachineify(this.words);

    this.writeUsForm = this._formBuilder.group({
      name: ['', Validators.required],
      email_id: ['', [
        Validators.required,
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
      ]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });

    // this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
  }

  // ngAfterViewInit(): void {
  //   try {
  //     document.querySelector('#' + this.fragment).scrollIntoView();
  //   } catch (e) {alert("aaaa") }
  // }

  openLogin() {
    this.dialog.open(
      LoginComponent, {
        width: '480px', panelClass: 'popup_wrapper', disableClose: true
      }
    );
  }

  btnClickNav(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && (form.get(field).dirty || form.get(field).touched);
  }

  submitWriteUs() {

    if (this.writeUsForm.valid) {
      
      this.generalService.send_contact_mail(this.writeUsForm.value).subscribe(
        response => {
          console.log(response.data);
          this.toastr.success('Email has been sent successfully.', '', {
            timeOut: 3000,
          });

          this.writeUsForm.reset();
          
        },
        error => {
          
          this.toastr.error('Something went wrong', '', {
            timeOut: 3000,
          });
        }
      );

    }
    else {

      this.markFormGroupTouched(this.writeUsForm)
    }

  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'is-invalid': form.get(field).invalid && (form.get(field).dirty || form.get(field).touched),
      'is-valid': form.get(field).valid && (form.get(field).dirty || form.get(field).touched)
    };
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }

  slotMachineify(_expression) {
    var _words = _expression[0],
      _wordsDiv = [],
      _letters = [' ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
      _current = 0,
      _nbrLetters = 15,
      _init = null;

    (function () {
      initHey();
      initStock();
      createWordsDiv();
      createWordsSpan();
      placeLetters();
      wordsRoll();
    })();

    function initHey() {
      _init = setInterval(function () {
        _current++;
        if (_current >= _expression.length) {
          _current = 0;
        }
        _words = _expression[_current];
        wordsRoll();
      }, 3000);
    }

    function initStock() {
      var _lgth = 0;
      for (var j = 0; j < _expression.length; j++) {
        for (var i = 0; i < _expression[j].length; i++) {
          if (_expression[j][i].length > _lgth) {
            _lgth = _expression[j][i].length;
            _nbrLetters = _expression[j][i].length;
          }
        }
      }
    }

    function createWordsDiv() {
      for (var i = 0; i < _words.length; i++) {
        var myElem = document.getElementById('letras');
        if (myElem != null) {
          myElem.innerHTML += '<div id="word"></div>';
          _wordsDiv.push('#word');
        }

      }
    }

    function createWordsSpan() {
      for (var i = 0; i < _wordsDiv.length; i++) {
        for (var k = 0; k < _nbrLetters; k++) {
          document.getElementById('word').innerHTML += '<span class="word-span" ></span>';
        }
      }
    }

    function placeLetters() {
      var str;
      for (var k = 0; k < _wordsDiv.length; k++) {
        let wordSpan = document.getElementsByClassName('word-span') as HTMLCollectionOf<HTMLElement>;
        if (wordSpan.length != 0) {

          for (var i = 0; i < wordSpan.length; i++) {
            wordSpan[i].style.top = '0';
            for (var n = 0; n < _letters[0].length; n++) {
              wordSpan[i].style.top = '0';
              if (_letters[0].charAt(n) !== ' ') {
                str = '<p id=' + _letters[0].charAt(n) + '>' + _letters[0].charAt(n) + '</p>';
              } else {
                str = '<p>' + _letters[0].charAt(n) + '</p>';
              }
              wordSpan[i].innerHTML += str;
            }
          }
        }
      }
    }

    function wordsRoll() {
      let wordSpan = document.getElementsByClassName('word-span') as HTMLCollectionOf<HTMLElement>;
      for (var k = 0; k < _wordsDiv.length; k++) {

        for (var i = 0; i < _nbrLetters; i++) {
          if (_words[k] !== undefined) {
            if (_words[k].split('')[i] !== ' ' && _words[k].split('')[i] !== undefined) {
              if (wordSpan[i] !== undefined) {
                wordSpan[i].style.top = document.getElementById(_words[k].split('')[i]).offsetTop * -1 + 'px';
              }
            } else {
              if (wordSpan[i] !== undefined) {
                wordSpan[i].style.top = '0';
              }
            }
          }
        }
      }
    }
  }
}
