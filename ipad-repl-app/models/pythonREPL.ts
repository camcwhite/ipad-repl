import { API_URL } from "../env";
import assert from "assert";

export const MAX_RESPONSE_LINES = 1452;

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
  inputFinished():boolean; 

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
  public inputFinished():boolean { return true; }

}

class REPLUnfinishedInputResponse implements REPLResponse {

  /**
   * @inheritdoc
   */
  public responseText():string {
    throw Error("REPL did not receive complete input.")
  }

  /**
   * @inheritdoc
   */
  public inputFinished():boolean { return false; }

}

export class REPLSession {

  private static readonly sessions = new Array<REPLSession>();

  private sessionID:number | undefined = undefined;

  public constructor() {
    makeNewSessionRequest().then((response) => response.json()).then((data) => this.sessionID = data.session_id)
    // end all other sessions
    REPLSession.sessions.forEach((session) => session.endSession());
    REPLSession.sessions.push(this)
  }

  /**
   * Determine if this session is ready to send code
   * 
   * @returns true if this session is ready to receive code to send to the 
   *          REPL server
   */
  public isReady():boolean {
    return this.sessionID !== undefined
  }

  /**
   * Send a piece of code to the backend and call a callback function once a 
   * response is given
   * 
   * @param input lines of input code
   * @param callback function to call when the backend responds to the input, 
   *                  should expect a REPLResponse object as input 
   */
  public sendCode(input:Array<string>, callback:(response: REPLResponse) => void): void {
    if (this.sessionID === undefined) {
      throw new Error("REPL Session not ready for input") 
    }
    console.log('Session ID', this.sessionID);
    this.makeCommandPostRequest(input.join('\n'))
      .then((response) => response.json())
      .then((data) => (data.unfinished ? new REPLUnfinishedInputResponse() : new REPLTextResponse(data.output)))
      .then(callback);
  }

  /**
   * Tell the backend server that this session is no longer being used and can
   * be discarded
   */
  public endSession():void {
    this.makeEndSessionRequest();
  }

  private makeCommandPostRequest(inputText:string): Promise<Response> {
    assert(this.sessionID !== undefined, "Session ID is undefined");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: inputText, session_id: this.sessionID }),
    };
    const url = API_URL + '/python/new-command/'
    return fetch(url, requestOptions)
  }

  private makeEndSessionRequest(): void {
    assert(this.sessionID !== undefined, "Session ID is undefined");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: this.sessionID }),
    };
    const url = API_URL + '/python/end-session/'
    fetch(url, requestOptions)
  }
}


function makeNewSessionRequest(): Promise<Response> {
  const url = API_URL + `/python/new-session/`
  return fetch(url)
}