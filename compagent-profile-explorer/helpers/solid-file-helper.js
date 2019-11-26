import  '../vendor/solid-file-client/solid-file-client.bundle.js';


export class SolidFileHelper {
  constructor() {
    this.fileClient = SolidFileClient;
    console.log(this.fileClient)

  }

  readFolder(uri){
    console.log("readFolder",uri)
    return  this.fileClient.readFolder(uri).then(folder => {
       console.log(`Read ${folder.name}, it has ${folder.files.length} files.`);
      return folder
    }, err => {
      console.log(err) ;
      return err;
    });
  }

  readFile(uri){
    console.log("readFile",uri)
    return  this.fileClient.readFile(uri).then(body => {
         console.log(`File content is : ${body}.`);
      return body
    }, err => {
      console.log(err) ;
      return err;
    });
  }

}
