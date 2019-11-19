// Import the LitElement base class and html helper function
import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../js/agents/HelloAgent.js';

// Extend the LitElement base class
class PadElement extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      count: {type: Number},
      notes: {type: Array}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.count = 0;
  this.notes = []
  }

  firstUpdated(changedProperties) {
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("webId")){
        app.webId = message.webId
        console.log(this.id+"receive webId "+app.webId)
        if (app.webId != null){
          app.getUserData()

        }
      }
    };
  }

  getUserData(){
    var app = this;
    showFileInConsole(app.webId)
    //showFileInConsole('https://vincentt.inrupt.net/profile/card')
    Tripledoc.fetchDocument(app.webId).then(
      doc => {
        //    console.log("DOC",doc)
        //    console.log(doc.getStatements())
        app.doc = doc;
        app.person = doc.getSubject(app.webId);
        console.log("personne",app.person)
        app.username = app.person.getString(app.FOAF('name'))
        app.friends = app.person.getAllRefs(app.FOAF('knows'))
        console.log("Friends",app.friends)
        app.initNotePod()
      },
      err => {
        console.log(err)
      }
    );
  }

  initNotePod(){
    var app = this;
    app.publicTypeIndexUrl = app.person.getRef(app.SOLID('publicTypeIndex'))
    //console.log("publicTypeIndexUrl",app.publicTypeIndexUrl)

    Tripledoc.fetchDocument(app.publicTypeIndexUrl).then(
      publicTypeIndex => {
        app.publicTypeIndex = publicTypeIndex;
        app.notesListEntry = app.publicTypeIndex.findSubject(app.SOLID('forClass'), app.SCHEMA('TextDigitalDocument'));
        //  console.log("app.notesListEntry",app.notesListEntry)
        if (app.notesListEntry === null){
          app.notesListUrl = app.initialiseNotesList(app.person, app.publicTypeIndex)
        }else{
          app.notesListUrl = app.notesListEntry.getRef(app.SOLID("instance"))
          //  console.log("notesListUrl",app.notesListUrl)

        }
        app.getNotes()
      },
      err => {console.log(err)}
    );
  }


  getNotes(){
    var app = this;
    console.log("getNotes at ",app.notesListUrl)
    showFileInConsole(app.notesListUrl)
    Tripledoc.fetchDocument(app.notesListUrl).then(
      notesList => {
        app.notesList = notesList;

        //  console.log("app.notesList",notesList)
        app.notesUri = notesList.findSubjects(app.RDF('type'),app.SCHEMA('TextDigitalDocument'))
        //  console.log("notesUri",app.notesUri)
        app.notes = []
        app.notesUri.forEach(function (nuri){
          //var subj = nuri.getLocalSubject()
          //  console.log("nuri",nuri)
          //  console.log("doc",nuri.getDocument())
          var text = nuri.getString(app.SCHEMA('text'))
          var date = nuri.getDateTime(app.SCHEMA('dateCreated'))
          //  console.log(text, date)
          var note = {}
          note.text = text;
          note.date = date
          //text = nuri.getAllStrings()*/
          app.notes = [... app.notes, note]
        })
      })
    }



    addNote(){
      var app = this
      var note = this.shadowRoot.getElementById('notearea').value.trim()
      this.shadowRoot.getElementById('notearea').value = ""
      console.log(note)
      //var date = new Date().toUTCString();
      //var str = aujourdhui.toUTCString();  // Obsolète ! Utilisez toUTCString()
      //  console.log(date)
      const newNote = app.notesList.addSubject();
      // Indicate that the Subject is a schema:TextDigitalDocument:
      newNote.addRef(app.RDF('type'), app.SCHEMA('TextDigitalDocument'));
      // Set the Subject's `schema:text` to the actual note contents:
      newNote.addLiteral(app.SCHEMA('text'), note);
      // Store the date the note was created (i.e. now):
      newNote.addLiteral(app.SCHEMA('dateCreated'), new Date(Date.now()))

      app.notesList.save([newNote]).then(
        success=>{
          console.log("success")
          app.initNotePod()
        },
        err=>{
          console.log(err)
        });


      }



      initialiseNotesList(profile,typeIndex){
        var app = this;
        console.log("creation a revoir")
        const storage = profile.getRef(app.SPACE('storage'))
        console.log("storage",storage)
        const notesListUrl = storage + 'public/notes.ttl';

        const notesList = Tripledoc.createDocument(notesListUrl);
        notesList.save();

        // Store a reference to that Document in the public Type Index for `schema:TextDigitalDocument`:
        const typeRegistration = typeIndex.addSubject();
        typeRegistration.addRef(app.RDF('type'), app.SOLID('TypeRegistration'))
        typeRegistration.addRef(app.SOLID('instance'), notesList.asRef())
        typeRegistration.addRef(app.SOLID('forClass'), app.SCHEMA('TextDigitalDocument'))
        typeIndex.save([ typeRegistration ]);

        return notesListUrl
        /*// Get the root URL of the user's Pod:
        const storage = profile.getRef(space.storage);

        // Determine at what URL the new Document should be stored:
        const notesListUrl = storage + 'public/notes.ttl';
        // Create the new Document:
        const notesList = createDocument(notesListUrl);
        await notesList.save();

        // Store a reference to that Document in the public Type Index for `schema:TextDigitalDocument`:
        const typeRegistration = typeIndex.addSubject();
        typeRegistration.addRef(rdf.type, solid.TypeRegistration)
        typeRegistration.addRef(solid.instance, document.asRef())
        typeRegistration.addRef(solid.forClass, schema.TextDigitalDocument)
        await typeIndex.save([ typeRegistration ]);

        // Then finally return the new Document:
        return notesList;
        */
      }


  render() {

    const noteList = (notes) => html`
    Note List with template (${notes.length})<br>
    <ul>
    ${notes.map((n) => html`
      <li>
      ${n.text}, ${n.date}<br>
      </li>
      `)}
      </ul>
      `;

    return html`
    <p>Name : ${this.name}</p>
    <p>Count: ${this.count}</p>
    <p>${this.message}</p>
    <button @click=${this.clickHandler}>Test Agent from ${this.name} in lithtml</button>


    <textarea id ="notearea">

    </textarea>
    <br>
    <button @click=${this.addNote}>Add note</button>
    <br>
    <p>

    ${noteList(this.notes)}
    </p>


    `;
  }

  clickHandler(event) {
    this.count++
    //console.log(event.target);
    console.log(this.agent)
    this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
  }

}
// Register the new element with the browser.
customElements.define('pad-element', PadElement);
