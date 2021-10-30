export interface REPLResponse {
  
  /**
   * Get the response text from this REPL Response
   * @throws Error if the REPL expected another line of input
   * @returns the response text
   */
  responseText():string;

  /**
   * Check if this REPL Response has a completed input (no more lines expected)
   * @returns true if the REPL is ready to return response text, false otherwise
   */
  responseComplete():boolean; 

}

class REPLTextResponse implements REPLResponse {

  public constructor(public readonly inputText) {}

  /**
   * @inheritdoc
   */
  public responseText():string {
    return `REPL Response. Input was:\n${this.inputText}`;
  }

  /**
   * @inheritdoc
   */
  public responseComplete():boolean { return true; }

}

class REPLUnfinishedResponse implements REPLResponse {

  /**
   * @inheritdoc
   */
  public responseText():string {
    throw Error("REPL did not receive complete input.")
  }

  /**
   * @inheritdoc
   */
  public responseComplete():boolean { return false; }

}

export function getResponse(input:Array<string>): REPLResponse {
  if (input.slice(-1)[0].slice(-1) === ':') 
    return new REPLUnfinishedResponse();
  else return new REPLTextResponse(input.join('\n'));
}