

function slog(text, emitter =null){
  //console.log(text)
emitter != null ? $('#messageslist').prepend("<li>"+emitter +" : "+ text+"</li>") :  $('#messageslist').prepend("<li>"+text+"</li>");

}

export { slog }
