var FingerprintMatcher = function(probe) {
    this.probe = probe;
};

FingerprintMatcher.prototype.match = function(candidate) {
    // Calculate the similarity score of the two fingerprints
    var similarityScore = this.probe.compare(candidate);
    return similarityScore;
};

var fingerprint = "1234567890ABCDEF";
var candidate = "Anvith123";

// Create a FingerprintMatcher object
var matcher = new FingerprintMatcher(fingerprint);

document.addEventListener("DOMContentLoaded", function () {
   
    Fingerprint2.get({}, function (components) {
        var fingerprint = Fingerprint2.x64hash128(components.map(function (pair) {
            return pair.value;
        }).join(), 31);

        console.log("Generated Fingerprint:", fingerprint);
    });
});

async function register() {
    try {
      const publicKey = await generatePublicKey();
      const credential = await navigator.credentials.create({ publicKey });

      sendCredentialToServer(credential);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }

  async function login() {
    try {
      const publicKey = await generatePublicKey();
      const credential = await navigator.credentials.get({ publicKey });

      sendCredentialToServer(credential);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  function generatePublicKey() {
    return {
      challenge: new Uint8Array(32), 
      rp: { name: 'Example Corp' },
      user: {
        id: new Uint8Array(16), 
        name: 'john.doe@example.com',
        displayName: 'John Doe'
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 } 
      ],
      authenticatorSelection: { userVerification: 'preferred' },
      timeout: 60000,
      attestation: 'direct'
    };
  }

  function sendCredentialToServer(credential) {
    fetch('/register-or-authenticate-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential }),
    })
    .then(response => {
      if (response.ok) {
        console.log('Credential sent successfully.');
      } else {
        console.error('Failed to send credential to server.');
      }
    })
    .catch(error => console.error('Error sending credential:', error));
  }