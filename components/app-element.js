// Import the LitElement base class and html helper function
import { LitElement, html } from 'https://cdn.pika.dev/lit-element/^2.2.1';

// Use relative paths for peer dependencies
import './my-element.js';
import './my-card.js';
import './my-ldflex.js';
import './my-rdflib.js';
import './my-tripledoc.js';
import './my-geolocation.js';

class AppElement extends LitElement{
  render(){
    return html`



    <my-ldflex message="parcours d'un POD public" name="Public with LDFLEX" source = "https://smag0.solid.community/public/"></my-ldflex>
    <my-rdflib message="parcours d'un POD public" name="Public with RDFLIB" source = "https://smag0.solid.community/public/"></my-rdflib>
    <my-tripledoc message="parcours d'un POD public" name="Public with TRIPLEDOC" source = "https://smag0.solid.community/public/"></my-tripledoc>

      <my-geolocation message="activate your geolocation or not" name="Geolocation" ></my-geolocation>

      <my-card message="parcours d'un POD public" name="Public" source = "https://smag0.solid.community/public/"></my-card>

      <my-card message="parsing d'un fichier ttl" name="role" source = "https://smag0.solid.community/public/holacratie/Schema/role.ttl"></my-card>

    `;
  }
}
customElements.define('app-element', AppElement);
