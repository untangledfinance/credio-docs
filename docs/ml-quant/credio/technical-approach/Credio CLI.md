# Credio CLI

## Installation
The following criteria must be met in the Modeler’s device/machine:
Python 3.11.9+ and its associated package installer (pip) installed;
That’s it.
To install Credio CLI, the following command can be used:
```
pip install untangled-credio-cli
```
To check if the installation was successful or not, run:

```
credio version
```

## Authentication/authorization
To interact with the Credio platform, the Modeler must have a Credio account. The Modeler can register for their account either via the Credio’s official website (Web UI) or via Credio CLI. For registration via Credio CLI, the Modeler can use the following command:
credio me register
and then pass their specific information to the coming prompts to finish the process.
Once the registration is successfully, the Modeler can use login to the Credio platform by using the following command with their credentials:

```
credio me login
```

## List challenges/competitions
For listing all available challenges/competitions, the Modeler can use the following command:
```
credio competition list
```
The result includes the information of all available challenges in the Credio platform and will look like:

1 challenge available.
[
  {
	"id": 1,
	"manifesto_id": "67685e2d-4f36-4608-b755-b7f8cdd6ba21",
	"created_by": "7041972a-12ac-4be2-a845-d50317bd234d",
	"created_at": "2024-07-11T16:14:41.512652+00:00"
  }
]
The important information here is the two attributes of a given challenge:
Identifier (id): representing the identifier of a specific challenge in the Credio platform; and
Manifesto (manifesto_id): identifier of an artifact in the Credio platform that actually links to a specific content in the IPFS network (see the next section for more details).

## Download artifact
A Credio artifact is a platform-managed entity that links to a specific content in the IPFS network. An artifact can represent as either a single file or a folder.
Once the Modeler has an artifact’s identifier (a UUID-like text), they can easily look for the artifact’s information by using the command:
```
credio artifact info <ARTIFACT_ID>
```
Where ARTIFACT_ID  is the identifier of the artifact.
An artifact’s information will look like:
[
  {
	"content_id": "QmZwJvJZCMzDYMAG7J1m5kKNJmPbx7Nz3GLPhC6BQVMdet"
  }
]
Here, the content_id attribute is the content’s identifier in the IPFS network. Hence, the Modeler can now download the content via a given IPFS gateway (e.g. https://ipfs.io) or using the supported command from Credio CLI:
```
credio artifact download <ARTIFACT_ID>
```
The later approach is much more convenient and developer-friendly.

## Submit model
Submitting a model is a progress that the Modeler accepts to join a challenge by providing their ZKML model’s data to the Credio smart contract (short definition). The supported ZKML model’s data format at the moment is the content’s identifier in the IPFS network of the ZKML model that at least contains the following information:
The ZK circuit of the model;
The necessary ZK verifying keys/smart contracts;
The inference API specifications (protocol, host, endpoint, payload structure, etc.).
To obtain the IPFS content’s identifier, the Modeler can use any IPFS gateway to upload their files to the IPFS network. Credio CLI also supports this desire by providing an artifact-based uploading feature via the following command:
```
credio artifact upload <FILES>
```
where FILES is a list of specific files that need to be uploaded as a single content in the IPFS network. The result will contain the created artifact’s identifier that can be used to retrieve the associated IPFS content (see the previous section).

However, Credio CLI also supports a particular command for submitting a specific ZKML model for a given challenge:
```
credio model submit <CHALLENGE_ID> <FILES>
```
where CHALLENGE_ID is the identifier of the challenge in the Credio platform. The command’s successful result will contain the ZKML model’s identifier in the Credio platform and the Modeler can list their ZKML models by running the command:
credio model list
Of course, this submission step using Credio CLI is frankly to obtain the IPFS content’s identifier of the Modeler’s ZKML model that then is used to actually submit to the Credio smart contract.

## Consumption

### Register endpoint
For exposing local inference servers to the Internet, the Credio platform allows verified Modelers to start authorized secure connection (tunneling) to the Credio gateway and open a publicly-accessible endpoint for serving inference requests.
To register an endpoint for a specific submitted ZKML model, the Modeler can use the following command:
```
credio model register <MODEL_ID> --public-key-path <PUBLIC_KEY_PATH>
```
where MODEL_ID is the submitted model’s identifier and PUBLIC_KEY_PATH is the associated public key file that is used to authenticate the connection to the Credio gateway.
Serve model
Credio CLI supports the Modeler serving their local model at its associated endpoint (see previous section). The Modeler can start the connection for this endpoint by running the following command:
```
credio model serve --port <LOCAL_PORT> --private-key <PRIVATE_KEY_PATH>
```
where LOCAL_PORT is the listening port of the Modeler’s local inference server and PRIVATE_KEY_PATH is the associated private key file that is used to authenticate the connection. The private key must respect the public key registered for the endpoint.

## Tunneling mechanism 

[Detail]
