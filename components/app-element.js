// Import the LitElement base class and html helper function
import { LitElement, html } from 'https://cdn.pika.dev/lit-element/^2.2.1';

// Use relative paths for peer dependencies
import './my-element.js';
import './my-card.js';
import './my-geolocation.js';

class AppElement extends LitElement{
  render(){
    return html`

    <my-card message="parcours d'un POD public" name="Public" source = "https://smag0.solid.community/public/"></my-card>

    <my-card message="parsing d'un fichier ttl" name="role" source = "https://smag0.solid.community/public/holacratie/Schema/role.ttl"></my-card>

      <my-geolocation message="activate your geolocation or not" name="Geolocation" ></my-geolocation>

    `;
  }
}
customElements.define('app-element', AppElement);
