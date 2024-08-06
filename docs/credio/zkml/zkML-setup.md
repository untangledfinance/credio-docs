
# zkML Setup

## Introduction

Setting up zkML involve creating all the required artefacts to allow the generation of zero-knowledge proofs as and when required.

## Overview

We have partnered with zkonduit's ezkl library to facilitate zkML proof generation and verification. At a high level, ezkl's setup for a specific model involves:
- Generate and calibrate a JSON settings file through ezkl.generate_settings() and ezk.calibrate_settings() respectively. These settings will then be used to create a quantized Halo2 circuit to represent the underlying ML model
- Compile the ONNX model through ezkl.compile_circuit()
- Fetch the Structured Reference String (SRS) required for zkML's trustless setup
- Generate the proving and verifying keys (PK and VK, respectively) through ezkl.setup() 

Further technical details and a step-by-step guide can be found [here](link).
