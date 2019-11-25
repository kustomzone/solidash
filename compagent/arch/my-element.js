


class MyElement extends HTMLElement {
  constructor() {
    super();
    console.log("constructor")
  //  this.container = this.shadowRoot.querySelector('#container');
  const shadowRoot = this.attachShadow({mode: 'open'});
   shadowRoot.innerHTML = `
     <style>
       .disabled {
         opacity: 0.4;
       }
     </style>
     blip
      <div id="container"></div>
     blop
   `;


  }

  static get observedAttributes() {
    return ['foo', 'bar', 'disabled'];
  }

  connectedCallback() {
    // here the element has been inserted into the DOM
    console.log("connected")
      this.container = this.shadowRoot('#container');
  }

  disconnectedCallback(){

  }

  attributeChangedCallback(attr, oldVal, newVal) {
    //This callback will only be called for attributes that are present in the observedAttributes array, in this case foo and bar. For any other attribute that changes, the callback will not be called.
    switch(attr) {
      case 'foo':
      // do something with 'foo' attribute
      break;
      case 'bar':
      // do something with 'bar' attribute
      break;
      case 'disabled':
    if(this.disabled) {
          this.container.classList.add('disabled');
        }
        else {
          this.container.classList.remove('disabled')
        }
      break;


    }

  }
  //public method
  doSomething() {
   // do something in this method
   cosnole.log("i'm something")
 }
}



window.customElements.define('my-element', MyElement);
