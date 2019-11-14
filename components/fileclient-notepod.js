// Import the LitElement base class and html helper function
//https://github.com/inrupt/solid-lib-comparison
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../js/agents/HelloAgent.js';
//import  '../libs/rdflib.min.js';
import  '../libs/solid-file-client.bundle.js';
import { slog } from '../js/helpers/system-messages.js';
import { showFileInConsole } from '../js/helpers/debug.js';


// Extend the LitElement base class
class FileclientNotepod extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      source: {type: String},
      webId: {type: String},
      fileClient: {type: Object},
      username: {type: String},
      noteList: {type: Array},
      friends: {type: Array},
      names: {type: Array},
      debug: {type: String}
    };
  }

  constructor() {
    super();
    this.debug = "DEBUG : \n   "
    this.message = 'Hello world! From my-element';
    this.name = "unknown"
    this.source = "unknown"
    this.username = "unknown"
    this.noteList = [];
    this.friends = []
    this.names = []
    this.fileClient = SolidFileClient;
    console.log(this.fileClient)
    this.VCARD = new $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
    this.FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/');
    this.SOLID = new $rdf.Namespace('http://www.w3.org/ns/solid/terms#');
    this.SCHEMA = new $rdf.Namespace('http://schema.org/');
    this.SPACE = new $rdf.Namespace('http://www.w3.org/ns/pim/space#');
    this.RDF = new $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');

  }

  firstUpdated(changedProperties) {
    var app = this;

    this.agent = new HelloAgent(this.name);


    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("webId")){
        app.webId = message.webId
        console.log(this.id+"receive webId "+app.webId)

        if (app.webId != null){
          showFileInConsole(app.webId)


          app.fileClient.fetchAndParse(app.webId, 'text/turtle')
          .then(
            graph => {
              app.graph = graph;
              app.person = graph.sym(app.webId);
              console.log("fileclient person",app.person)
              app.profile = app.person.doc();       //i.e. store.sym(''https://example.com/alice/card#me')
              console.log("fileclient Profile",app.profile)

              app.showGraph()
              app.getName(app.webId)
              app.getNotesList()
              //  let something = graph.any(someSubject, somePredicate);
              /*app.friends = graph.each(person, FOAF('knows'))
              console.log(app.friends)*/
              /*
              await Promise.all(app.friends.map(((friendWebId) => this.fetcher.load(friendWebId.value))));
              this.names = this.friends.map((friend) => this.store.any(friend, FOAF('name'), null, friend.doc()));
              console.log("RDFLIB names",this.names)
              */
            },
            err =>{
              console.log(err)
              slog(err, "FileclientNotepod")
            });


          }

        }
      };

    }

    showGraph(){
      console.log(this.graph)
      let statements = this.graph.any(null,null);
      console.log("STATEMENTS",statements)
    }

    getName(webId){
      var app = this;
      let name = app.graph.any(app.person, app.FOAF('name'));
      console.log(name)
      if (name) {

        app.username =  name.value; // name is a Literal object
        app.debug += "name ok  "
      }
    }


    getNotesList(){
      var app = this;
      /*So to start with the first step: in which Document should we track notes? The answer can be found in the concept of the Public Type Index.

      The Public Type Index is itself a publicly accessible Document stored in the user’s Pod. This Document contains a list of links to other Documents, along with the type of data that is to be included in those Documents.
      */
      let publicTypeIndexUrl = app.graph.any(app.person, app.SOLID('publicTypeIndex'));
      slog("OK","publicTypeIndexUrl")
      app.publicTypeIndexUrl = publicTypeIndexUrl;

      app.debug += "publicTypeIndexUrl  " + publicTypeIndexUrl+ "  "
      //  console.log(app)
      showFileInConsole(publicTypeIndexUrl.value)
      app.fileClient.fetchAndParse(publicTypeIndexUrl.value, 'text/turtle')
      .then(
        publicTypeIndex => {
          app.publicTypeIndex = publicTypeIndex
          console.log("publicTypeIndex",publicTypeIndex)
          app.debug += "    publicTypeIndex  OK "
          slog( "OK", "publicTypeIndex in "+this.localName)

          //const notesListEntry = publicTypeIndex.findSubject(solid.forClass, schema.TextDigitalDocument);
          //const notesListEntry = app.graph.any(null, app.SOLID('forClass'), app.SCHEMA('TextDigitalDocument'));
          const notesListEntry = publicTypeIndex.each(null, app.SOLID('forClass'), app.SCHEMA('TextDigitalDocument'));
          console.log("notesListEntry",notesListEntry)
          if (notesListEntry.length == 0) {
            // We will define this function later:
            app.initialiseNotesList(app.profile, publicTypeIndex);
          }else{
            console.log(notesListEntry)
            const notesListUrl = publicTypeIndex.each($rdf.sym(notesListEntry[0].value), app.SOLID('instance'), null);
            console.log("notesListUrl", notesListUrl)
            app.notesListUrl = notesListUrl;
            showFileInConsole(notesListUrl[0].value)
            app.fileClient.fetchAndParse(notesListUrl[0].value, 'text/turtle')
            .then(
              noteList => {
                console.log("noteList",noteList)
                app.noteList = noteList
              })

            }

          },
          err =>{
            //console.log(err)
            // test erreur 403 Origin Unauthorized  --> add origin on
            app.debug += " \n   publicTypeIndex  ERREUR " +err
            slog(err, this.localName)
            if (err.indexOf('Origin Unauthorized') > -1){
              slog("You must add Origin to the POD's Trusted App", app.localName)
            }

          });


        }

        createNote(){
          var app = this
          app.initialiseNotesList(app.profile,app.publicTypeIndex)
        }

        deleteNote(){
          var app = this
          const storage = app.graph.each(app.person, app.SPACE('storage'), null);
          console.log("storage",storage)
          // Determine at what URL the new Document should be stored:
          const notesListUrl = storage[0].value + 'public/notes.ttl';
          //console.log(typeof notesListUrl)
          //  app.createEmptyDocument(location)
          app.fileClient.deleteFile(notesListUrl).then(
            success => {
              console.log(`deleted file ${success}.`);
            }, err => {
              console.log(err); alert(err);
            } );


          }

          initialiseNotesList(profile,publicTypeIndex){
            var app = this;
            console.log("CREATION notelist dans "+publicTypeIndex + "\n pour "+ profile )

            const storage = app.graph.each(app.person, app.SPACE('storage'), null);
            console.log("storage",storage)
            // Determine at what URL the new Document should be stored:
            const notesListUrl = storage[0].value + 'public/notes.ttl';
            console.log(typeof notesListUrl)

            var content = `
            @prefix : <#>.
            @prefix schem: <http://schema.org/>.
            @prefix XML: <http://www.w3.org/2001/XMLSchema#>.

            :157315672228346294578095965644
            a schem:TextDigitalDocument;
            schem:dateCreated "2019-11-07T19:58:42Z"^^XML:dateTime;
            schem:text "Second note".
            :1573156739481420194364517402
            a schem:TextDigitalDocument;
            schem:dateCreated "2019-11-07T19:58:59Z"^^XML:dateTime;
            schem:text "TROIS note".`
            //  app.createEmptyDocument(location)
            app.fileClient.createFile(notesListUrl, content).then(
              fileCreated => {
                console.log(`Created file ${fileCreated}.`);
                // Update PublicTypeIndex https://vincenttunru.gitlab.io/tripledoc/docs/cheatsheet.html#rdflib-3
                //https://github.com/solid/solid/blob/master/proposals/data-discovery.md



                //  let additions = $rdf.st(null, app.RDF('type'), app.SOLID('TypeRegistration'))
                //  let deletions = []



                const updater = new $rdf.UpdateManager(app.publicTypeIndex);
                console.log("updater",updater)
                /*
                data to update in https://smag0.solid.community/profile/publicTypeIndex.ttl
                @prefix : <#>.
                @prefix terms: <http://purl.org/dc/terms/>.
                @prefix ter: <http://www.w3.org/ns/solid/terms#>.
                @prefix schem: <http://schema.org/>.
                @prefix bookm: <http://www.w3.org/2002/01/bookmark#>.

                <> terms:references :Bookmark.

                :15731567065220463401473385443
                a ter:TypeRegistration;
                ter:forClass schem:TextDigitalDocument;
                ter:instance </public/notes.ttl>.
                */
                //  var id = app.publicTypeIndexUrl.value+":test";
                //  console.log("ID",id)
                console.log("RDF",$rdf)
                var local = new $rdf.Namespace(app.publicTypeIndexUrl.value+"#")
                var subj = 'notepodapp'
                //  console.log("SUBJ",subj)
                //  const updatePromise = new Promise((resolve) => {
                let additions = [
                  $rdf.st(local(subj), app.RDF('type'), app.SOLID('TypeRegistration'), app.publicTypeIndexUrl),
                  $rdf.st(local(subj), app.SOLID('forClass'), app.SCHEMA('TextDigitalDocument'), app.publicTypeIndexUrl),
                  $rdf.st(local(subj), app.SOLID('instance'), $rdf.sym(notesListUrl), app.publicTypeIndexUrl),
                ]
                let deletions = []
                //  const deletions = store.statementsMatching(me, sym('http://xmlns.com/foaf/0.1/nick'), null, me.doc());
                //  const additions = nicknames.map(nickname => st(me, sym('http://xmlns.com/foaf/0.1/nick'), new Literal(nickname), me.doc()));
                updater.update(deletions, additions).then(
                  updated => {
                    console.log("UPDATED",updated)
                    app.getNotesList()
                  } ,
                  err => {
                    console.log("ERREUR",err)
                  }
                );
                //  });


                /*  const updatePromise = new Promise((resolve, reject) => {
                updater.update(del, ins, (app.publicTypeIndexUrl, ok, message) => {
                if (ok) console.log('updated '+ app.publicTypeIndexUrl)
                else alert(message)
              })
            });*/
            //  await updatePromise;








          }, err => {
            console.log(err); alert(err);
          } );
          // --> app.noteList = noteList
        }

        addNote(){
          var app = this
          var note = this.shadowRoot.getElementById('notearea').value
          console.log(note)
          console.log(app.notesListUrl[0].value)
          var timestamp = Math.round(new Date().getTime());

          const store = $rdf.graph();
          const fetcher = new $rdf.Fetcher(store, {});
          fetcher.load(app.notesListUrl[0].value);
          //  const me = sym(currentSession.webId);
          const updater = new $rdf.UpdateManager(store);

          //const updater = new $rdf.UpdateManager(app.notesListUrl[0].value);
          console.log("updater",updater)
          //var local = new $rdf.Namespace(app.notesListUrl.value+"#")
          //console.log(local)
          //var note_id = local(timestamp)
          var date = new Date(timestamp)
          var subj = app.notesListUrl[0].value+"#test"
          console.log("SUBJ",subj)
          //  const updatePromise = new Promise((resolve) => {
          let additions = [
            $rdf.st($rdf.sym(subj), $rdf.sym(subj), $rdf.sym(subj),app.notesListUrl[0].value),
            //  $rdf.st($rdf.sym(subj), app.RDF('type'), app.SCHEMA('TextDigitalDocument'),app.notesListUrl[0].value),
            //  $rdf.st($rdf.Literal(timestamp), app.SCHEMA('text'), $rdf.Literal(note), app.notesListUrl[0]),
            //  $rdf.st($rdf.Literal(timestamp), app.SCHEMA('dateCreated'), $rdf.Literal(date), app.notesListUrl[0]),
          ]
          let deletions = []
          //  const deletions = store.statementsMatching(me, sym('http://xmlns.com/foaf/0.1/nick'), null, me.doc());
          //  const additions = nicknames.map(nickname => st(me, sym('http://xmlns.com/foaf/0.1/nick'), new Literal(nickname), me.doc()));
          updater.update(deletions, additions).then(
            updated => {
              console.log("UPDATED",updated)
              //  app.getNotesList()
            } ,
            err => {
              console.log("ERREUR",err)
            }
          );

        }




        async createEmptyDocument(location) {
          //  https://vincenttunru.gitlab.io/tripledoc/docs/cheatsheet.html#rdflib-7
          const store = $rdf.graph();
          //  const updater = new UpdateManager(store);
          const updater = new $rdf.UpdateManager(store);
          console.log("updater",updater)
          const creationPromise = new Promise((resolve, reject) => {
            updater.put($rdf.sym(location), [], 'text/turtle', (_url, success, message) => {
              if (success) {
                resolve();
              } else {
                reject(new Error(message));
              }
            });
          });
          await creationPromise;
        }






          render() {
            return html`
            <!-- Custom fonts for this template-->
            <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
            <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

            <!-- Custom styles for this template-->
            <link href="css/sb-admin-2.min.css" rel="stylesheet">
            <link href="css/main.css" rel="stylesheet">

            <!--<div class="col-xl-4 col-lg-5">-->
            <div class="card shadow mb-4">
            <!-- Card Header - Dropdown -->
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Name : ${this.name}</h6>
            <div class="dropdown no-arrow">
            <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
            <div class="dropdown-header">Dropdown Header:</div>
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">Something else here</a>
            </div>
            </div>
            </div>
            <!-- Card Body -->
            <div class="card-body">
            <p>Name : ${this.name}</p>
            <p>WebId : ${this.webId}</p>
            <small>Don't forget to add your server to trusted apps in your preference's POD</small>
            <p> Username : ${this.username}</p>

            <p> Friends : ${this.friends.length}</p>
            <p> Note List ${this.noteList.length}</p>
            <p>debug : </p>
            ${this.debug}


            <pre class="pre-scrollable">
            <ul id="messageslist">
            ${this.friends.map((f) => html`<li>${f.value}</li>`)}
            </ul>
            </pre>

            <p>${this.message} à ${this.source}</p>
            <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>
            <br>

            <textarea id ="notearea">

            </textarea>
            <br>
            <button @click=${this.addNote}>Add note</button>
            <br>


            !! FOR TEST !!!
            <button @click=${this.createNote}>Create notes.ttl</button>
            <br>
            <button @click=${this.deleteNote}>Delete notes.ttl</button>
            <br>


            <small>https://forum.solidproject.org/t/notepod-a-note-taking-app-for-solid/2371</small><br>
            <small>https://github.com/jeff-zucker/solid-file-client</small><br>
            <small>https://solidproject.org/for-developers/apps/first-app/2-understanding-solid</small>
            </div>
            </div>
            <!--  </div>-->




            `;
          }

          clickHandler(event) {
            //console.log(event.target);
            console.log(this.agent)
            this.agent.send('agent1', 'Hello agent1!');
          }

        }
        // Register the new element with the browser.
        customElements.define('fileclient-notepod', FileclientNotepod);


        /*const sparql = `
        SELECT *
        WHERE
        {
        <${notesListEntry[0].value}> ?p ?o.
      }`
      console.log("SPARQL",sparql)
      let query = $rdf.SPARQLToQuery(sparql, false, publicTypeIndex);
      return new Promise((accept,reject) =>
      publicTypeIndex.query(query, result =>
      {
      console.log("RESULT",result["?s"],result["?p"]),result["?p"]
    },
    err => {accept()}
  )
);
*/
