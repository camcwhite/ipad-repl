import {defer, Deferred} from "q";
import { API_URL } from "../env";

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

export class REPLTextResponse implements REPLResponse {

  public constructor(public readonly inputText:string) {
  }

  /**
   * @inheritdoc
   */
  public responseText():string {
    return `${this.inputText}`;
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

function makeRequest(inputText:string, sessionID:number): Promise<Response> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: inputText, session_id: sessionID }),
  };
  const url = API_URL + '/python/new-command/'
  return fetch(url, requestOptions);
}

/**
 * 
 * @param input lines of input code
 * @param callback function to call when the backend responds to the input 
 */
export function getResponse(input:Array<string>, sessionID:number, callback:(response: REPLResponse) => void): void {
  // if (input.slice(-1)[0].slice(-1) === ':' || input.length > 1 && input.slice(-1)[0] !== '') 
  //   return new REPLUnfinishedResponse();
  // else return new REPLTextResponse(input.join('\n'));
  makeRequest(input.join('\n'), sessionID)
    .then((response) => response.json())
    .then((data) => (data.unfinished ? new REPLUnfinishedResponse() : new REPLTextResponse(data.output)))
    .then(callback);
}