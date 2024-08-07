# zkML Proof Generation

## Introduction

zkML proof generation involves creating a single zero-knowledge proof (ZKP) of a given output from the zk-circuit of a committed ML model. The resultant proof allows any third-party verifier (with access to the required ezkl collaterals) to trustlessly verify whether the claimed output did indeed come from the claimed zk-circuit of a given model.
After the one-time setup of ezkl has been successfully completed, proof generation is relatively straight-forward and takes much less time compared to the setup.

## Overview

At a high level, proof generation involves the following steps:

- Generate a witness file through `ezkl.gen_witness()`
- Perform a mock run through `ezkl.mock()` as a sanity check to confirm the correctness of the witness file
- Generate the proof through `ezkl.prove()`

Further technical details and a step-by-step guide can be found [here].
