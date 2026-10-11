# Encryption setup and validation

Current changes require production MongoDB TLS with certificate/hostname validation and reject disabling or bypassing TLS through URI options. Database names are now parsed separately from connection query parameters. Development connections retain their existing options. Set `NODE_ENV=production` on Render and deploy the backend. Test connectivity before promoting the release. This does not encrypt database disks or backups; verify those settings in the database provider dashboard.

Game authentication and API URL overrides now require HTTPS. Invalid/plain HTTP overrides fall back to the existing HTTPS backend. Unity Relay continues to use DTLS.

## Dedicated direct multiplayer

Direct ranked servers require PEM certificate and private-key files mounted outside the Unity project. Set:

```
RANKED_TLS_CERT_FILE=/run/secrets/ranked-cert.pem
RANKED_TLS_KEY_FILE=/run/secrets/ranked-key.pem
```

Use a certificate valid for the ranked service hostname. Configure renewal and restart/reload procedures on the actual server host. Do not place private keys in Git, Resources, client builds or chat. These files are required on the dedicated Unity server, not the Render Express API unless it also runs the Unity process.

In the Unity project create `Assets/Resources/NetworkSecurity.json` with public settings:

```
{"serverName":"YOUR_RANKED_CERTIFICATE_HOSTNAME","caResource":""}
```

The serverName must match the server certificate. An empty caResource uses system trust. For a private CA, include only its public PEM certificate as a TextAsset and put its Resources path without extension in caResource. Prefer a managed/public certificate where supported. The endpoint address supplied by matchmaking and certificate identity must refer to the intended server. Do not use certificate validation bypasses.

The server refuses startup without certificate/key files. Clients refuse remote direct connections without their public settings. Thus direct/ranked play is temporarily unavailable until configured; no plaintext fallback is provided. Existing editor-local transport paths and Relay have separate configuration.

## Required verification

1. Compile Unity and build both dedicated server and Android client.
2. Verify a valid certificate permits connection, and expired/untrusted/wrong-host certificates reject connection before credentials are delivered to an untrusted endpoint.
3. Verify missing configuration blocks direct connections; Relay still connects over DTLS.
4. Inspect network traffic to confirm the match token and gameplay payload are not readable.
5. Confirm deployed MongoDB TLS and hosting storage/backup encryption, access controls and key management. Do not share the URI/password.
6. Confirm enabled SDK/ad adapters follow their documented encryption practices.

Backend focused tests passed locally. Unity compilation, certificate handshake, packet capture, deployed database connectivity, and storage/backup settings remain unverified. No certificates were provisioned and no deployment was performed by these changes.

Sources: https://docs.unity.cn/Packages/com.unity.netcode.gameobjects%402.13/api/Unity.Netcode.Transports.UTP.UnityTransport.html and https://www.mongodb.com/docs/manual/reference/connection-string-options/
