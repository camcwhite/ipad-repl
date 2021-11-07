import {defer, Deferred} from "q";
import { API_URL } from "../env";
import { MAX_RESPONSE_LINES } from "../components/REPLScreen";

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

  private readonly text;

  public constructor(inputText:string) {
    const lines = inputText.split('\n');
    if (lines.length > MAX_RESPONSE_LINES) {
      lines[MAX_RESPONSE_LINES-1] = `[Only showing first ${MAX_RESPONSE_LINES-1} lines of output]`
    }
    this.text = lines.slice(0, MAX_RESPONSE_LINES).join('\n')
  }

  /**
   * @inheritdoc
   */
  public responseText():string {
    return this.text;
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

function makeRequest(inputText:string): Promise<Response> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: inputText, session_id: 1 }),
  };
  const url = API_URL + '/python/new-command/'
  console.log(`making fetch: ${url}`);
  return fetch(url, requestOptions)
}

/**
 * 
 * @param input lines of input code
 * @param callback function to call when the backend responds to the input 
 */
export function getResponse(input:Array<string>, callback:(response: REPLResponse) => void): void {
  // if (input.slice(-1)[0].slice(-1) === ':' || input.length > 1 && input.slice(-1)[0] !== '') 
  //   return new REPLUnfinishedResponse();
  // else return new REPLTextResponse(input.join('\n'));
  makeRequest(input.join('\n'))
    .then((response) => response.json())
    .then((data) => (data.unfinished ? new REPLUnfinishedResponse() : new REPLTextResponse(data.output)))
    .then(callback);
}