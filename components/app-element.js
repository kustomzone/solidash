// Import the LitElement base class and html helper function
import { LitElement, html } from 'https://cdn.pika.dev/lit-element/^2.2.1';

// Use relative paths for peer dependencies
import './my-element.js';
import './my-card.js';
import './my-ldflex.js';
import './my-rdflib.js';
import './my-fileclient.js';
import './my-tripledoc.js';
import './my-geolocation.js';
import './fileclient-notepod.js';

class AppElement extends LitElement{
  render(){
    return html`


    <my-tripledoc
    message="parcours d'un POD public"
    name="Public with TRIPLEDOC"
    source = "https://smag0.solid.community/public/">
    </my-tripledoc>
<!--
    <fileclient-notepod
    message="Notepod avec https://github.com/jeff-zucker/solid-file-client"
    name="NOTEPOD with Solid File Client"
    source = "unknown">
    </fileclient-notepod>

    <my-rdflib
    message="parcours d'un POD public"
    name="Public with RDFLIB"
    source = "https://smag0.solid.community/public/">
    </my-rdflib>

    <my-fileclient
    message="parcours d'un POD public avec https://github.com/jeff-zucker/solid-file-client"
    name="Public with Solid File Client"
    source = "https://smag0.solid.community/public/">
    </my-fileclient>



    <my-ldflex
    message="parcours d'un POD public"
    name="Public with LDFLEX"
    source = "https://smag0.solid.community/public/">
    </my-ldflex>

    <my-geolocation
    message="activate your geolocation or not"
    name="Geolocation">
    </my-geolocation>

    <my-card message="parcours d'un POD public" name="Public" source = "https://smag0.solid.community/public/"></my-card>

    <my-card message="parsing d'un fichier ttl" name="role" source = "https://smag0.solid.community/public/holacratie/Schema/role.ttl"></my-card>
-->

    `;
  }
}
customElements.define('app-element', AppElement);
