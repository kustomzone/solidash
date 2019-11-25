import { Namespaces } from '../helpers/namespaces.js';

export class TripledocHelper {
  constructor() {
    this.ns = new Namespaces()
  }


  getNameFromCard(card){
//  var module = this;
    var name = Tripledoc.fetchDocument(card).then(
      doc => {
        console.log("doc",doc)
        const subject = card+"#me"
        const person = doc.getSubject(subject);
        console.log("person ", person)
        name = person.getString(this.ns.FOAF("name"))
        console.log("name",name)
        return name
      },
      err =>{
        console.log("erreur ",err)
        return err
      }
    );
    return name;
  }


}
