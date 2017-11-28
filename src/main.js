/* global window, Image, XMLHttpRequest */
import Mads, { fadeOutIn } from 'mads-custom';
import './main.css';

class AdUnit extends Mads {
  render() {
    return `
      <div class="container" id="ad-container">
        <div class="screens" id="screen1"></div>
        <div class="screens" id="screen2">
          <form id="signup">
            <input required type="text" id="inputName" class="form-input" name="name" placeholder="Name" pattern="^(?!s+).*" />
            <input required type="email" id="inputEmail" class="form-input" name="email" placeholder="Email" />
            <input required type="number" id="inputNumber" class="form-input" name="hp" placeholder="H/P" />
            <input type="image" id="btnSubmit" src="${this.data.btnSubmit}" />
          </form>
        </div>
        <div class="screens" id="screen3">
          <img src="${this.data.tcsApply}" id="tcsApply">
        </div>
      </div>
    `;
  }

  style() {
    return [
      `
      #ad-container {
      }
      #screen1 {
        background: url(${this.resolve(this.data.screen1)});
      }
      #screen2 {
        background: url(${this.resolve(this.data.screen2)});
        display: none;
      }
      #screen3 {
        background: url(${this.resolve(this.data.screen3)});
        display: none;
      }
      `];
  }

  events() {
    this.elems.screen1.addEventListener('mousedown', () => {
      fadeOutIn(this.elems.screen1, this.elems.screen2, {
        display: 'flex',
      });
      this.tracker('E', 'signup');
    });

    this.elems.signup.addEventListener('submit', (e) => {
      console.log('submit', e);
      this.tracker('E', 'submit');
      this.elems.btnSubmit.disabled = true;

      if (this.elems.inputName.value !== '' && this.elems.inputEmail.value !== '' && this.elems.inputNumber.value !== '') {
        // https://www.mobileads.com/api/save_lf?contactEmail=&gotDatas=1&element=[{%22fieldname%22:%22text_1%22,%22value%22:%22jeff%22,%22required%22:%22required%22},{%22fieldname%22:%22text_2%22,%22value%22:%22test@test.com%22,%22required%22:%22required%22},{%22fieldname%22:%22text_3%22,%22value%22:%2212312312312313%22,%22required%22:%22required%22}]&user-id=3774&studio-id=51&tab-id=1&trackid=2607&referredURL=Sample%20Ad%20Unit&callback=leadGenCallback&_=1511276689625
        // MWEB
        this.loadJS(`https://www.mobileads.com/api/save_lf?contactEmail=&gotDatas=1&element=[{%22fieldname%22:%22text_1%22,%22value%22:%22${this.elems.inputName.value}%22,%22required%22:%22required%22},{%22fieldname%22:%22text_2%22,%22value%22:%22${this.elems.inputEmail.value}%22,%22required%22:%22required%22},{%22fieldname%22:%22text_3%22,%22value%22:%22${this.elems.inputNumber.value}%22,%22required%22:%22required%22}]&user-id=3774&studio-id=51&tab-id=1&trackid=2607&referredURL=${this.elems.inputNumber.value}&callback=leadGenCallback&_=1511276689625`);

        // InApp
        // this.loadJS(`https://www.mobileads.com/api/save_lf?contactEmail=&gotDatas=1&element=[{%22fieldname%22:%22text_1%22,%22value%22:%22${this.elems.inputName.value}%22,%22required%22:%22required%22},{%22fieldname%22:%22text_2%22,%22value%22:%22${this.elems.inputEmail.value}%22,%22required%22:%22required%22},{%22fieldname%22:%22text_3%22,%22value%22:%22${this.elems.inputNumber.value}%22,%22required%22:%22required%22}]&user-id=3774&studio-id=55&tab-id=1&trackid=2607&referredURL=${this.elems.inputNumber.value}&callback=leadGenCallback&_=1511276689625`);

        const xhr = new XMLHttpRequest();
        // studioId = 51 = MWEB
        // studioId = 52 = InApp
        xhr.open('POST', `https://www.mobileads.com/api/coupon/generate_coupon?phoneNo=${this.elems.inputNumber.value}&userId=3774&studioId=51&email=${this.elems.inputEmail.value}&name=${this.elems.inputName.value}`, true);
        xhr.send();
      }


      e.preventDefault();
      return false;
    });

    this.elems.screen3.addEventListener('click', () => {
      this.tracker('E', 'tc_tap');
      this.tracker('CTR', 'landing');
      this.linkOpener('http://bit.ly/2ziARLl');
    });
  }
}

window.ad = new AdUnit();
window.leadGenCallback = (res) => {
  if (res.status) {
    const imgQrCode = new Image();
    imgQrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${window.ad.elems.inputNumber.value}`;
    imgQrCode.id = 'qrcode';
    imgQrCode.onload = () => {
      window.ad.elems.screen3.innerHTML += `<div id="couponCode">${window.ad.elems.inputNumber.value}</div>`;
      window.ad.elems.screen3.appendChild(imgQrCode);
      fadeOutIn(window.ad.elems.screen2, window.ad.elems.screen3, {
        display: 'block',
      });
    };
  }
};
