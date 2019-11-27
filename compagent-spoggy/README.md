# Fonctionnement
- litelement -> WebComponents
- evejs -> agents & communication between Components
- tripledoc (with rdflib)-> get profile, friends, typeIndex, Storage (data in files), acl
- solid-file-client -> explore folders, read files (folders & files)




# TripledocHelper
https://vincenttunru.gitlab.io/tripledoc/docs/cheatsheet
https://forum.solidproject.org/t/help-using-different-libs-rdflibjs-tripledoc-ldflex-solid-file-client/2388/3?u=smag0

//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';

```
<html>
<head>
<meta charset="utf-8">
<script src="./vendor/lit-element/polyfill.min.js"></script>


<!-- tripledoc import https://forum.solidproject.org/t/help-using-different-libs-rdflibjs-tripledoc-ldflex-solid-file-client/2388/3?u=smag0 -->
<script src="./vendor/rdflib/rdflib.min.js"></script>
<script>
window.rdflib = window.$rdf;
</script>
<script src="./vendor/tripledoc/tripledoc.js"></script>
<!--<script src="https://unpkg.com/tripledoc@2.4/umd/index.js"></script>-->

<script type="module" src="./components/component-app.js"></script>
<script type="module" src="./components/messages-component.js"></script>
<script type="module" src="./components/tripledoc-profile.js"></script>
<script type="module" src="./components/browser-component.js"></script>
</head>
<body>
<component-app name="App"></component-app>

<browser-component name="Browser"></browser-component>
<messages-component name="Messages"></messages-component>

<tripledoc-profile name="TripledocProfile"></tripledoc-profile>
</body>
</html>

```
# a voir aussi
https://fr.vuejs.org/v2/guide/components.html
