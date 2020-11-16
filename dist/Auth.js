"use strict";
// import got from 'got'
// import JWT from 'jsonwebtoken'
// import NodeCache from 'node-cache'
// import { Cache } from './Utils'
// import querystring from 'querystring'
// ​
// const AUTH_SERVICE_URL = 'https://api-auth.chatdaddy.tech'
// const DEF_TOKEN_EXPIRY = 60 // default token expiry in minutes
// ​
// export type APIUser = {
//     teamId: string
//     id: string
//     token: string
// }
// ​
// export class AuthenticationController {
//     protected refreshToken: string
//     protected publicKey: Buffer
//     protected cache = new NodeCache ({ stdTTL: DEF_TOKEN_EXPIRY*60*1000 - 1000 }) // expire one second before actual expiry
//     constructor (refreshToken: string) {
//         this.refreshToken = refreshToken
//     }
//     async init () {
//         // fetch the public key for JWT verification
//         const url = new URL('public/public.pem', AUTH_SERVICE_URL)
//         const response = await got.get(url)
//         // store the key
//         this.publicKey = response.rawBody
//     }
//     /** verify a token */
//     async authenticate (token: string): Promise<APIUser> {
//         const user: any = JWT.verify (token, this.publicKey, { algorithms: [ 'ES256' ] })
//         return {
//             id: user.user.id,
//             teamId: user.user.teamId,
//             token: token,
//         }
//     }
//     /** get a token for any given team */
//     async getToken (teamId: string): Promise<string> {
//         if (!this.cache.get(teamId)) {
//             const url = new URL('oauth/token', AUTH_SERVICE_URL)
//             const requestBody = {
//                 refresh_token: this.refreshToken,
//                 team_id: teamId,
//                 grant_type: "team_token",
//                 expiration: DEF_TOKEN_EXPIRY
//             }
//             const response = await got.post (url, { body: querystring.encode (requestBody), headers: { 'content-type': 'application/x-www-form-urlencoded' } })
//             const responseJSON = JSON.parse (response.body)
//             this.cache.set (teamId, responseJSON.accessToken)
//         }
//         return this.cache.get(teamId)
//     }
// }
//# sourceMappingURL=Auth.js.map