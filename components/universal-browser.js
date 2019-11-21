<div
id="universal-browser"
class="mdc-dialog"
role="alertdialog"
aria-modal="true"
aria-labelledby="ub-title"
aria-describedby="ub-content">
<div class="mdc-dialog__container">
  <div class="mdc-dialog__surface">
    <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
    <h2 class="mdc-dialog__title" id="ub-title"><!--
    -->Universal Browser   <span>
    <i
    class="material-icons mdc-list-item__graphic"
    aria-hidden="true"
    data-mdc-dialog-action="yes"
    >
    clear</i>
  </span><!--
  --></h2>

  <div class="mdc-tab-bar" id="open-tab-bar" role="tablist">
    <div class="mdc-tab-scroller">
      <div class="mdc-tab-scroller__scroll-area">
        <div class="mdc-tab-scroller__scroll-content">
          <button class="mdc-tab mdc-tab--active" role="tab" aria-selected="true" tabindex="0" onclick="selectOpenTab(this)">
            <span class="mdc-tab__content">
              <!--  <span class="mdc-tab__icon material-icons" aria-hidden="true">folder_open</span>-->
              <span class="mdc-tab__text-label">Editeur</span>
            </span>
            <span class="mdc-tab-indicator mdc-tab-indicator--active">
              <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
            </span>
            <span class="mdc-tab__ripple"></span>
          </button>

          <button class="mdc-tab  mdc-tab--active" role="tab"  onclick="selectOpenTab(this)">
            <span class="mdc-tab__content">
              <span class="mdc-tab__icon material-icons" aria-hidden="true">cloud_queue</span>
              <span class="mdc-tab__text-label">Local</span>
            </span>
            <span class="mdc-tab-indicator mdc-tab-indicator--active">
              <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
            </span>
            <span class="mdc-tab__ripple"></span>
          </button>


          <button class="mdc-tab  mdc-tab--active" role="tab"  onclick="selectOpenTab(this)">
            <span class="mdc-tab__content">
              <span class="mdc-tab__icon material-icons" aria-hidden="true">cloud_queue</span>
              <span class="mdc-tab__text-label">Pod</span>
            </span>
            <span class="mdc-tab-indicator mdc-tab-indicator--active">
              <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
            </span>
            <span class="mdc-tab__ripple"></span>
          </button>


          <button class="mdc-tab  mdc-tab--active" role="tab" onclick="selectOpenTab(this)">
            <span class="mdc-tab__content">
              <span class="mdc-tab__icon material-icons" aria-hidden="true">cloud</span>
              <span class="mdc-tab__text-label">Temps réel</span>
            </span>
            <span class="mdc-tab-indicator mdc-tab-indicator--active">
              <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
            </span>
            <span class="mdc-tab__ripple"></span>
          </button>




        </div>
      </div>
    </div>
  </div>

  <div class="mdc-dialog__content" id="ub-content">

    <section>
      <div class="js-panels" for='open-tab-bar'>
        <div id="mdc-tab-1-panel" class="js-panel is-active" role="tabpanel" aria-hidden="false">

          <!-- editeur -->
          <div>
            Format :
            <button
            type="button"
            class="mdc-button mdc-dialog__button"
            onclick="catchCommande({value:'/e'})">
            <span class="mdc-button__label">json</span>
          </button>
          <button
          type="button"
          class="mdc-button mdc-dialog__button"
          onclick="catchCommande({value:'/t'})">
          <span class="mdc-button__label">ttl</span>
        </button>
      </div>
      <!--  <p>
      dossier courant :   <div id="current-folder-url"></div>
      <input id="new-folder-input" style="width:80%"  placeholder="Nom de dossier"></input>
      <button id="new-folder-btn" onclick="createFolder()">Créer un dossier</button><br>
      <input id="new-file-input" style="width:80%"  placeholder="Nom de fichier"></input>
      <button id="jsonSave-btn" onclick="jsonSave()">Enregistrer en JSON sur le POD</button>
      <button id="turtleSave-btn" onclick="turtleSave()">Enregistrer en Turtle (ttl) sur le POD</button><br>
    </p>-->

    <!--  <div class="mdc-dialog__surface">-->
    <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
    <!--  <h2 class="mdc-dialog__title" id="editor-dialog-title">Editeur
    <span onclick="(function(){ document.getElementById('editeur-popUp').style.display = 'none'; })();"> X</span>
  </h2>-->
  <!--  <div class="mdc-dialog__content" id="editor-dialog-content" >-->
  <pre id="editor"></pre>
  <!--  </div>-->
  <div>
    <button
    type="button"
    class="mdc-button mdc-dialog__button"

    onclick="downloadFile()">
    <span class="mdc-button__label">Telecharger</span>
  </button>

  <button
  type="button"
  class="mdc-button mdc-dialog__button"

  onclick="openPodBrowser()">
  <span class="mdc-button__label">Enregistrer sur un POD</span>
</button>
<!--
<button
type="button"
class="mdc-button mdc-dialog__button"
data-mdc-dialog-action="yes"
onclick="(function(){ document.getElementById('editeur-popUp').style.display = 'none'; })();">
<span class="mdc-button__label">Fermer</span>
</button>-->
</div>



</div>
<div id="mdc-tab-2-panel" class="js-panel" role="tabpanel" aria-hidden="true">
  <input type="checkbox" id="remplaceNetwork" name="remplaceNetwork">Remplacer le graphe</input> <br><br>
  <!--<input type="checkbox" id="partageImport"  name="partageImport"disabled >Partager Import</input>-->
  <filedset>
    <legend>Depuis mon disque dur</legend>
    <input id="filepicker" type="file" multiple value="Importer" onchange="handleFileSelected(this, updateGraph)"></input>
  </fieldset>

  <filedset>
    <legend>Depuis une url</legend>
    <input id="filepicker"  value="Importer" onchange="handleFileSelected(this, updateGraph)"></input>
  </fieldset>
</div>

<div id="mdc-tab-3-panel" class="js-panel" role="tabpanel" aria-hidden="true">
  <div >
    <button
    type="button"
    class="mdc-button"
    onclick="changePod('public')">
    <span class="mdc-button__label">POD public</span>
  </button>
  <a href="https://agora.solid.community/public" target="_blank">https://agora.solid.community/public</a><br>
  <button
  type="button"
  class="mdc-button logout"
  onclick="changePod('connecte')">
  <span class="mdc-button__label">POD Connecté</span>
</button>
<button
type="button"
class="mdc-button login"
data-mdc-dialog-action="yes"
onclick="login()">
<span class="mdc-button__label">Se connecter sur un POD</span>
</button>
<button
type="button"
class="mdc-button logout"
data-mdc-dialog-action="yes"
onclick="logout()">
<span class="mdc-button__label">Se deconnecter du POD</span>
</button>
<br>
<input id="importUrl" style="width:80%" placeholder="Url / POD"></input>
<button onclick="importFromUrl()">Importer</button><br>
<input type="text" id="pod2browse" style="width:80%"  placeholder="Url du POD"></input>

<br>
<button
type="button"
class="mdc-button"
data-mdc-dialog-action="yes"
onclick="profile()">
<span class="mdc-button__label">Profile</span>
</button>
<button
type="button"
class="mdc-button"
data-mdc-dialog-action="yes"
onclick="friends()">
<span class="mdc-button__label">Friends</span>
</button>
</div>



<div class="mdc-card" >
  <input id="ub-url"></input>
  <div class="mdc-card" id="ub-up">UP</div>
  <!-- ... content ... -->
</div>
<div class="mdc-card" id="ub-parent">
  contenu
  <span class="mdc-tab__icon material-icons" aria-hidden="true">arrow_upward</span>
  <!-- ... content ... -->
</div>

liste:   <ul id="ub-liste">
</ul>

</div>






<!--
<div class="mdc-card" >
<div  id="arrow-upward">
<span class="mdc-tab__icon material-icons" aria-hidden="true">arrow_upward</span>
</div>
url :  <input id="ub-url"></input>
parent : <input id="ub-parent" ></input>
up :<input id="ub-up">UP</input>
menu:   <span id="ub-menu">menu</span>
liste:   <ul id="ub-liste">
</ul>
</div>-->

<div id="mdc-tab-4-panel" class="js-panel" role="tabpanel" aria-hidden="false">
  Distant et Collab

</div>
</div>




</section>



<!--
<button type="button" class="mdc-button mdc-dialog__button">
<span class="mdc-button__label raised" onclick="validInput()">Valider</span>
</button>
-->
</div>
<footer class="mdc-dialog__actions">
  <!--<button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
  <span class="mdc-button__label">No</span>
</button>-->
<button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes">
  <span class="mdc-button__label">Fermer</span>
</button>
</footer>
</div>
</div>

<div class="mdc-dialog__scrim"></div>
</div>
