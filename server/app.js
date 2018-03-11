import './modules/newrelic';

import express from 'express';
import mongoose from 'mongoose';
import cron from 'node-cron';

import config from './configs';

import parse from './helpers/parse';

import fs from 'fs';
const https = require('https');
// import renderer from './helpers/renderer';
// import createStore from './helpers/createStore';
// // import Routes from '../client/src/routes';
// import { matchRoutes } from 'react-router-config';

var path = require('path');

const app = express();
const port = process.env.PORT || config.port;

const cert = `{"type":"Buffer","data":[45,45,45,45,45,66,69,71,73,78,32,67,69,82,84,73,70,73,67,65,84,69,45,45,45,45,45,10,77,73,73,70,66,84,67,67,65,43,50,103,65,119,73,66,65,103,73,83,65,47,50,109,120,67,118,111,118,68,118,119,71,51,107,80,72,55,120,50,70,102,74,79,77,65,48,71,67,83,113,71,83,73,98,51,68,81,69,66,67,119,85,65,10,77,69,111,120,67,122,65,74,66,103,78,86,66,65,89,84,65,108,86,84,77,82,89,119,70,65,89,68,86,81,81,75,69,119,49,77,90,88,81,110,99,121,66,70,98,109,78,121,101,88,66,48,77,83,77,119,73,81,89,68,86,81,81,68,10,69,120,112,77,90,88,81,110,99,121,66,70,98,109,78,121,101,88,66,48,73,69,70,49,100,71,104,118,99,109,108,48,101,83,66,89,77,122,65,101,70,119,48,120,79,68,65,122,77,68,81,121,77,84,81,119,78,84,78,97,70,119,48,120,10,79,68,65,50,77,68,73,121,77,84,81,119,78,84,78,97,77,66,119,120,71,106,65,89,66,103,78,86,66,65,77,84,69,88,100,51,100,121,53,108,100,109,86,117,100,72,78,109,99,109,86,108,76,109,74,53,77,73,73,66,73,106,65,78,10,66,103,107,113,104,107,105,71,57,119,48,66,65,81,69,70,65,65,79,67,65,81,56,65,77,73,73,66,67,103,75,67,65,81,69,65,122,75,52,73,115,109,78,99,69,76,114,65,113,113,81,118,120,50,47,43,112,116,99,98,51,86,110,88,10,78,89,118,43,82,66,83,120,67,69,72,120,74,83,68,103,77,113,115,116,122,83,114,104,100,98,102,90,108,55,121,90,69,55,67,65,54,103,80,101,109,86,107,67,78,104,107,54,108,77,90,82,76,97,100,111,72,100,66,105,78,49,90,98,10,105,48,67,78,105,104,106,56,57,54,110,116,115,101,78,120,85,97,87,106,81,111,73,77,101,117,43,54,53,48,48,113,120,98,56,90,85,54,82,113,117,81,82,72,122,53,87,67,85,43,56,120,102,88,115,116,119,102,82,67,76,110,111,90,10,83,73,50,84,100,87,50,109,80,74,118,116,119,67,112,111,121,65,113,119,84,76,98,112,57,75,86,50,104,113,89,115,102,79,54,67,70,85,78,99,103,117,103,111,81,49,116,56,103,110,72,65,53,71,86,106,120,77,82,88,43,51,43,108,10,112,72,79,101,43,54,74,81,101,53,122,48,67,107,54,118,80,50,86,119,110,43,78,55,57,66,82,85,88,81,85,102,108,57,121,43,110,52,113,110,108,54,88,104,74,103,89,87,86,101,69,98,57,51,74,105,43,119,77,104,118,112,105,116,10,67,82,78,116,88,98,68,54,76,65,80,72,103,79,51,47,113,89,120,111,48,74,51,70,112,120,52,68,115,50,113,49,97,53,79,67,53,48,105,97,77,71,101,106,98,115,97,105,53,82,50,105,81,82,69,89,55,81,73,68,65,81,65,66,10,111,52,73,67,69,84,67,67,65,103,48,119,68,103,89,68,86,82,48,80,65,81,72,47,66,65,81,68,65,103,87,103,77,66,48,71,65,49,85,100,74,81,81,87,77,66,81,71,67,67,115,71,65,81,85,70,66,119,77,66,66,103,103,114,10,66,103,69,70,66,81,99,68,65,106,65,77,66,103,78,86,72,82,77,66,65,102,56,69,65,106,65,65,77,66,48,71,65,49,85,100,68,103,81,87,66,66,81,114,88,112,74,71,74,50,106,105,88,90,102,104,109,100,112,56,109,84,111,55,10,68,82,105,117,50,84,65,102,66,103,78,86,72,83,77,69,71,68,65,87,103,66,83,111,83,109,112,106,66,72,51,100,117,117,98,82,79,98,101,109,82,87,88,118,56,54,106,115,111,84,66,118,66,103,103,114,66,103,69,70,66,81,99,66,10,65,81,82,106,77,71,69,119,76,103,89,73,75,119,89,66,66,81,85,72,77,65,71,71,73,109,104,48,100,72,65,54,76,121,57,118,89,51,78,119,76,109,108,117,100,67,49,52,77,121,53,115,90,88,82,122,90,87,53,106,99,110,108,119,10,100,67,53,118,99,109,99,119,76,119,89,73,75,119,89,66,66,81,85,72,77,65,75,71,73,50,104,48,100,72,65,54,76,121,57,106,90,88,74,48,76,109,108,117,100,67,49,52,77,121,53,115,90,88,82,122,90,87,53,106,99,110,108,119,10,100,67,53,118,99,109,99,118,77,66,119,71,65,49,85,100,69,81,81,86,77,66,79,67,69,88,100,51,100,121,53,108,100,109,86,117,100,72,78,109,99,109,86,108,76,109,74,53,77,73,72,43,66,103,78,86,72,83,65,69,103,102,89,119,10,103,102,77,119,67,65,89,71,90,52,69,77,65,81,73,66,77,73,72,109,66,103,115,114,66,103,69,69,65,89,76,102,69,119,69,66,65,84,67,66,49,106,65,109,66,103,103,114,66,103,69,70,66,81,99,67,65,82,89,97,97,72,82,48,10,99,68,111,118,76,50,78,119,99,121,53,115,90,88,82,122,90,87,53,106,99,110,108,119,100,67,53,118,99,109,99,119,103,97,115,71,67,67,115,71,65,81,85,70,66,119,73,67,77,73,71,101,68,73,71,98,86,71,104,112,99,121,66,68,10,90,88,74,48,97,87,90,112,89,50,70,48,90,83,66,116,89,88,107,103,98,50,53,115,101,83,66,105,90,83,66,121,90,87,120,112,90,87,81,103,100,88,66,118,98,105,66,105,101,83,66,83,90,87,120,53,97,87,53,110,73,70,66,104,10,99,110,82,112,90,88,77,103,89,87,53,107,73,71,57,117,98,72,107,103,97,87,52,103,89,87,78,106,98,51,74,107,89,87,53,106,90,83,66,51,97,88,82,111,73,72,82,111,90,83,66,68,90,88,74,48,97,87,90,112,89,50,70,48,10,90,83,66,81,98,50,120,112,89,51,107,103,90,109,57,49,98,109,81,103,89,88,81,103,97,72,82,48,99,72,77,54,76,121,57,115,90,88,82,122,90,87,53,106,99,110,108,119,100,67,53,118,99,109,99,118,99,109,86,119,98,51,78,112,10,100,71,57,121,101,83,56,119,68,81,89,74,75,111,90,73,104,118,99,78,65,81,69,76,66,81,65,68,103,103,69,66,65,73,119,106,100,108,69,108,113,88,79,84,77,67,47,107,75,77,122,70,114,107,56,55,107,65,97,107,114,111,110,82,10,108,70,65,73,48,54,117,47,117,74,75,111,55,121,51,80,121,82,121,86,111,111,56,87,115,56,113,106,82,77,117,114,66,105,66,99,80,90,111,70,99,53,50,74,85,77,53,86,114,76,68,100,85,105,75,50,81,90,98,105,52,50,47,52,10,83,47,52,88,71,107,114,99,71,84,77,65,102,55,106,48,114,80,80,74,53,118,84,107,89,101,76,87,105,102,66,80,85,52,74,68,81,121,54,108,80,69,78,102,56,120,47,86,121,81,43,77,100,104,110,83,114,52,51,86,78,57,57,89,10,75,47,90,111,113,116,97,111,87,54,120,49,114,89,74,115,119,73,73,54,50,75,83,100,56,51,73,102,82,82,116,98,48,110,53,120,75,48,76,82,114,66,75,55,74,66,114,82,49,107,79,85,87,90,107,117,79,83,100,77,99,121,84,120,10,75,122,51,87,107,72,87,47,48,81,110,98,43,90,56,90,71,86,88,53,69,112,84,70,55,90,67,118,98,121,121,117,121,107,115,75,88,67,52,107,116,104,66,84,67,115,55,71,117,89,85,51,109,100,70,81,101,102,48,99,114,83,66,68,10,68,79,43,104,67,50,65,88,70,85,103,72,116,109,106,50,87,99,87,103,86,109,89,67,48,47,100,67,86,116,69,88,53,51,105,108,82,50,67,83,70,53,108,115,79,76,87,89,87,66,69,76,100,121,77,61,10,45,45,45,45,45,69,78,68,32,67,69,82,84,73,70,73,67,65,84,69,45,45,45,45,45,10,45,45,45,45,45,66,69,71,73,78,32,67,69,82,84,73,70,73,67,65,84,69,45,45,45,45,45,10,77,73,73,69,107,106,67,67,65,51,113,103,65,119,73,66,65,103,73,81,67,103,70,66,81,103,65,65,65,86,79,70,99,50,111,76,104,101,121,110,67,68,65,78,66,103,107,113,104,107,105,71,57,119,48,66,65,81,115,70,65,68,65,47,10,77,83,81,119,73,103,89,68,86,81,81,75,69,120,116,69,97,87,100,112,100,71,70,115,73,70,78,112,90,50,53,104,100,72,86,121,90,83,66,85,99,110,86,122,100,67,66,68,98,121,52,120,70,122,65,86,66,103,78,86,66,65,77,84,10,68,107,82,84,86,67,66,83,98,50,57,48,73,69,78,66,73,70,103,122,77,66,52,88,68,84,69,50,77,68,77,120,78,122,69,50,78,68,65,48,78,108,111,88,68,84,73,120,77,68,77,120,78,122,69,50,78,68,65,48,78,108,111,119,10,83,106,69,76,77,65,107,71,65,49,85,69,66,104,77,67,86,86,77,120,70,106,65,85,66,103,78,86,66,65,111,84,68,85,120,108,100,67,100,122,73,69,86,117,89,51,74,53,99,72,81,120,73,122,65,104,66,103,78,86,66,65,77,84,10,71,107,120,108,100,67,100,122,73,69,86,117,89,51,74,53,99,72,81,103,81,88,86,48,97,71,57,121,97,88,82,53,73,70,103,122,77,73,73,66,73,106,65,78,66,103,107,113,104,107,105,71,57,119,48,66,65,81,69,70,65,65,79,67,10,65,81,56,65,77,73,73,66,67,103,75,67,65,81,69,65,110,78,77,77,56,70,114,108,76,107,101,51,99,108,48,51,103,55,78,111,89,122,68,113,49,122,85,109,71,83,88,104,118,98,52,49,56,88,67,83,76,55,101,52,83,48,69,70,10,113,54,109,101,78,81,104,89,55,76,69,113,120,71,105,72,67,54,80,106,100,101,84,109,56,54,100,105,99,98,112,53,103,87,65,102,49,53,71,97,110,47,80,81,101,71,100,120,121,71,107,79,108,90,72,80,47,117,97,90,54,87,65,56,10,83,77,120,43,121,107,49,51,69,105,83,100,82,120,116,97,54,55,110,115,72,106,99,65,72,74,121,115,101,54,99,70,54,115,53,75,54,55,49,66,53,84,97,89,117,99,118,57,98,84,121,87,97,78,56,106,75,107,75,81,68,73,90,48,10,90,56,104,47,112,90,113,52,85,109,69,85,69,122,57,108,54,89,75,72,121,57,118,54,68,108,98,50,104,111,110,122,104,84,43,88,104,113,43,119,51,66,114,118,97,119,50,86,70,110,51,69,75,54,66,108,115,112,107,69,78,110,87,65,10,97,54,120,75,56,120,117,81,83,88,103,118,111,112,90,80,75,105,65,108,75,81,84,71,100,77,68,81,77,99,50,80,77,84,105,86,70,114,113,111,77,55,104,68,56,98,69,102,119,122,66,47,111,110,107,120,69,122,48,116,78,118,106,106,10,47,80,73,122,97,114,107,53,77,99,87,118,120,73,48,78,72,87,81,87,77,54,114,54,104,67,109,50,49,65,118,65,50,72,51,68,107,119,73,68,65,81,65,66,111,52,73,66,102,84,67,67,65,88,107,119,69,103,89,68,86,82,48,84,10,65,81,72,47,66,65,103,119,66,103,69,66,47,119,73,66,65,68,65,79,66,103,78,86,72,81,56,66,65,102,56,69,66,65,77,67,65,89,89,119,102,119,89,73,75,119,89,66,66,81,85,72,65,81,69,69,99,122,66,120,77,68,73,71,10,67,67,115,71,65,81,85,70,66,122,65,66,104,105,90,111,100,72,82,119,79,105,56,118,97,88,78,121,90,121,53,48,99,110,86,122,100,71,108,107,76,109,57,106,99,51,65,117,97,87,82,108,98,110,82,121,100,88,78,48,76,109,78,118,10,98,84,65,55,66,103,103,114,66,103,69,70,66,81,99,119,65,111,89,118,97,72,82,48,99,68,111,118,76,50,70,119,99,72,77,117,97,87,82,108,98,110,82,121,100,88,78,48,76,109,78,118,98,83,57,121,98,50,57,48,99,121,57,107,10,99,51,82,121,98,50,57,48,89,50,70,52,77,121,53,119,78,50,77,119,72,119,89,68,86,82,48,106,66,66,103,119,70,111,65,85,120,75,101,120,112,72,115,115,99,102,114,98,52,85,117,81,100,102,47,69,70,87,67,70,105,82,65,119,10,86,65,89,68,86,82,48,103,66,69,48,119,83,122,65,73,66,103,90,110,103,81,119,66,65,103,69,119,80,119,89,76,75,119,89,66,66,65,71,67,51,120,77,66,65,81,69,119,77,68,65,117,66,103,103,114,66,103,69,70,66,81,99,67,10,65,82,89,105,97,72,82,48,99,68,111,118,76,50,78,119,99,121,53,121,98,50,57,48,76,88,103,120,76,109,120,108,100,72,78,108,98,109,78,121,101,88,66,48,76,109,57,121,90,122,65,56,66,103,78,86,72,82,56,69,78,84,65,122,10,77,68,71,103,76,54,65,116,104,105,116,111,100,72,82,119,79,105,56,118,89,51,74,115,76,109,108,107,90,87,53,48,99,110,86,122,100,67,53,106,98,50,48,118,82,70,78,85,85,107,57,80,86,69,78,66,87,68,78,68,85,107,119,117,10,89,51,74,115,77,66,48,71,65,49,85,100,68,103,81,87,66,66,83,111,83,109,112,106,66,72,51,100,117,117,98,82,79,98,101,109,82,87,88,118,56,54,106,115,111,84,65,78,66,103,107,113,104,107,105,71,57,119,48,66,65,81,115,70,10,65,65,79,67,65,81,69,65,51,84,80,88,69,102,78,106,87,68,106,100,71,66,88,55,67,86,87,43,100,108,97,53,99,69,105,108,97,85,99,110,101,56,73,107,67,74,76,120,87,104,57,75,69,105,107,51,74,72,82,82,72,71,74,111,10,117,77,50,86,99,71,102,108,57,54,83,56,84,105,104,82,122,90,118,111,114,111,101,100,54,116,105,54,87,113,69,66,109,116,122,119,51,87,111,100,97,116,103,43,86,121,79,101,112,104,52,69,89,112,114,47,49,119,88,75,116,120,56,47,10,119,65,112,73,118,74,83,119,116,109,86,105,52,77,70,85,53,97,77,113,114,83,68,69,54,101,97,55,51,77,106,50,116,99,77,121,111,53,106,77,100,54,106,109,101,87,85,72,75,56,115,111,47,106,111,87,85,111,72,79,85,103,119,117,10,88,52,80,111,49,81,89,122,43,51,100,115,122,107,68,113,77,112,52,102,107,108,120,66,119,88,82,115,87,49,48,75,88,122,80,77,84,90,43,115,79,80,65,118,101,121,120,105,110,100,109,106,107,87,56,108,71,121,43,81,115,82,108,71,10,80,102,90,43,71,54,90,54,104,55,109,106,101,109,48,89,43,105,87,108,107,89,99,86,52,80,73,87,76,49,105,119,66,105,56,115,97,67,98,71,83,53,106,78,50,112,56,77,43,88,43,81,55,85,78,75,69,107,82,79,98,51,78,54,10,75,79,113,107,113,109,53,55,84,72,50,72,51,101,68,74,65,107,83,110,104,54,47,68,78,70,117,48,81,103,61,61,10,45,45,45,45,45,69,78,68,32,67,69,82,84,73,70,73,67,65,84,69,45,45,45,45,45,10]}`
const key = `{"type":"Buffer","data":[45,45,45,45,45,66,69,71,73,78,32,80,82,73,86,65,84,69,32,75,69,89,45,45,45,45,45,10,77,73,73,69,118,119,73,66,65,68,65,78,66,103,107,113,104,107,105,71,57,119,48,66,65,81,69,70,65,65,83,67,66,75,107,119,103,103,83,108,65,103,69,65,65,111,73,66,65,81,68,77,114,103,105,121,89,49,119,81,117,115,67,113,10,112,67,47,72,98,47,54,109,49,120,118,100,87,100,99,49,105,47,53,69,70,76,69,73,81,102,69,108,73,79,65,121,113,121,51,78,75,117,70,49,116,57,109,88,118,74,107,84,115,73,68,113,65,57,54,90,87,81,73,50,71,84,113,85,10,120,108,69,116,112,50,103,100,48,71,73,51,86,108,117,76,81,73,50,75,71,80,122,51,113,101,50,120,52,51,70,82,112,97,78,67,103,103,120,54,55,55,114,110,84,83,114,70,118,120,108,84,112,71,113,53,66,69,102,80,108,89,74,84,10,55,122,70,57,101,121,51,66,57,69,73,117,101,104,108,73,106,90,78,49,98,97,89,56,109,43,51,65,75,109,106,73,67,114,66,77,116,117,110,48,112,88,97,71,112,105,120,56,55,111,73,86,81,49,121,67,54,67,104,68,87,51,121,67,10,99,99,68,107,90,87,80,69,120,70,102,55,102,54,87,107,99,53,55,55,111,108,66,55,110,80,81,75,84,113,56,47,90,88,67,102,52,51,118,48,70,70,82,100,66,82,43,88,51,76,54,102,105,113,101,88,112,101,69,109,66,104,90,86,10,52,82,118,51,99,109,76,55,65,121,71,43,109,75,48,74,69,50,49,100,115,80,111,115,65,56,101,65,55,102,43,112,106,71,106,81,110,99,87,110,72,103,79,122,97,114,86,114,107,52,76,110,83,74,111,119,90,54,78,117,120,113,76,108,10,72,97,74,66,69,82,106,116,65,103,77,66,65,65,69,67,103,103,69,66,65,73,112,90,69,70,80,84,121,85,85,100,108,109,70,66,80,88,74,110,66,119,43,113,48,112,68,90,121,120,102,77,109,110,57,87,74,82,116,90,120,121,43,55,10,101,119,43,69,109,82,55,87,51,122,74,56,112,76,49,108,111,50,113,108,111,86,50,77,90,65,102,118,72,65,109,74,73,65,109,122,121,117,99,55,65,113,115,48,85,85,55,113,78,108,74,51,118,98,81,99,107,57,67,114,115,90,106,79,10,68,97,105,77,100,122,47,98,79,54,104,86,74,108,90,49,50,72,86,49,97,66,56,98,81,87,47,120,114,115,66,110,90,73,74,114,97,86,53,82,120,109,111,86,79,105,55,69,74,82,98,102,97,48,54,121,89,79,48,83,48,75,57,85,10,82,85,98,84,69,78,55,72,83,55,84,78,70,69,107,84,109,50,85,90,105,104,102,118,89,52,48,69,50,110,81,103,108,86,56,51,115,107,75,47,113,80,102,119,43,102,68,112,90,107,103,88,99,115,103,51,68,121,99,69,52,111,51,88,10,87,104,111,86,104,65,53,121,113,89,43,77,88,50,121,110,89,80,49,103,113,116,68,77,50,80,120,120,85,78,98,75,70,65,109,103,67,52,117,117,53,99,84,72,110,56,65,100,114,77,115,117,89,114,72,83,85,107,82,75,84,117,108,112,10,119,83,72,67,71,76,105,85,103,51,81,76,106,74,118,83,115,90,65,65,89,97,89,84,52,81,106,110,117,107,52,90,43,103,88,43,52,119,101,47,82,48,69,67,103,89,69,65,56,80,119,122,112,54,48,55,81,116,68,77,53,111,118,66,10,99,80,65,49,69,122,75,50,86,54,83,79,73,56,67,84,66,65,71,82,74,72,120,69,77,73,50,102,113,75,88,109,77,65,110,50,50,103,67,112,109,97,78,84,69,120,49,84,80,54,81,50,86,87,90,70,115,111,81,76,81,114,87,104,10,69,81,79,98,76,84,71,100,113,107,114,51,48,113,74,74,108,67,48,49,53,55,76,116,52,73,53,116,90,101,99,48,109,78,103,53,54,99,116,102,72,90,103,103,118,115,85,83,119,112,51,67,73,67,57,107,111,80,114,81,99,67,86,86,10,74,111,100,69,109,72,56,77,111,86,51,70,109,105,104,82,89,85,120,83,89,107,87,67,104,99,107,67,103,89,69,65,50,87,54,47,121,115,110,67,56,55,66,76,108,81,113,108,49,75,56,52,82,114,90,77,82,103,114,81,77,77,88,78,10,97,54,80,122,77,119,112,113,122,98,98,119,47,72,119,52,66,74,70,47,75,121,72,49,78,122,53,65,43,69,84,83,43,54,87,117,85,48,115,108,86,66,90,83,98,67,106,72,97,89,120,109,67,49,88,111,57,80,104,105,107,122,78,110,10,65,105,50,76,117,89,105,118,82,66,102,104,69,43,49,82,53,52,67,88,43,65,71,113,71,50,112,97,57,121,84,101,105,110,110,54,85,47,68,48,106,114,69,118,115,101,107,66,68,115,81,50,78,57,73,81,70,70,108,47,57,76,122,77,10,116,68,102,120,105,84,77,79,110,65,85,67,103,89,69,65,51,90,80,88,88,119,53,43,86,99,73,116,70,76,74,100,55,66,49,66,102,43,82,54,71,110,51,89,110,47,68,54,102,73,50,65,83,104,55,107,105,65,120,65,83,69,52,54,10,74,43,79,82,107,81,78,89,55,107,90,112,74,85,77,113,102,51,76,97,55,111,122,53,43,116,108,69,106,86,76,53,120,79,52,101,54,87,65,99,105,121,56,104,84,82,65,104,80,86,105,81,110,118,107,55,108,101,84,47,109,57,111,74,10,49,53,118,66,76,69,72,116,116,65,86,106,51,109,84,81,67,104,103,75,72,90,80,87,72,57,112,101,101,121,56,111,97,121,79,110,73,57,120,49,51,89,50,101,71,107,43,70,47,69,79,122,52,70,51,118,86,70,107,67,103,89,65,103,10,102,89,85,90,82,49,98,106,86,83,101,109,75,77,89,111,53,116,110,119,55,120,75,115,115,76,98,49,89,115,108,85,87,86,90,103,47,83,67,67,104,117,67,120,121,100,111,82,68,76,68,70,65,68,107,70,80,84,56,50,71,103,113,119,10,52,99,119,80,49,68,51,75,116,57,56,118,72,70,84,88,57,56,118,84,121,56,50,89,116,88,106,57,97,65,80,118,100,109,68,88,111,52,52,86,68,99,66,114,87,116,52,80,83,115,55,113,108,48,48,85,57,97,113,77,72,97,49,72,10,89,102,121,47,67,70,86,121,56,82,85,103,98,54,72,104,48,47,52,75,68,49,67,112,121,99,110,117,66,122,120,76,102,99,83,81,55,78,107,49,66,81,75,66,103,81,67,56,97,118,70,78,67,121,87,105,71,72,87,83,116,84,115,78,10,108,107,120,54,86,43,67,53,53,65,111,66,75,111,110,86,49,55,118,107,81,52,80,68,57,83,57,72,116,56,72,110,120,89,83,120,75,75,115,70,50,53,47,54,107,69,111,119,48,83,79,51,98,75,81,79,82,108,79,90,86,111,49,106,10,55,102,76,69,101,76,80,119,76,114,76,105,80,47,48,108,111,55,115,109,100,72,68,52,81,112,90,113,77,76,82,118,88,112,101,105,98,102,80,85,88,72,84,66,89,72,112,65,118,121,52,104,80,81,48,76,107,66,104,109,56,55,111,84,10,118,122,49,76,106,85,71,86,89,106,52,83,118,70,79,82,102,69,114,78,98,121,107,80,100,103,61,61,10,45,45,45,45,45,69,78,68,32,80,82,73,86,65,84,69,32,75,69,89,45,45,45,45,45,10]}`

const options = {
  // cert: fs.readFileSync('/etc/letsencrypt/live/www.eventsfree.by/fullchain.pem'),
  // key: fs.readFileSync('/etc/letsencrypt/live/www.eventsfree.by/privkey.pem')
  cert: JSON.parse(cert),
  key: JSON.parse(key),
  // cert: fs.readFileSync(path.join(__dirname, '/sslcert/fullchain.pem')),
  // key: fs.readFileSync(path.join(__dirname, '/sslcert/privkey.pem'))
};

// debugger;

// express.listen(port);

app.listen(port, () => {
    console.log('Server ready on:', port);
  });

// express.listen(8080);
const server = https.createServer(options, app).listen(() => {
    console.log('Server ready on:', port);
  });

// const server = app.listen(port, () => {
//   console.log('Server ready on:', port);
// });
const io = require('socket.io').listen(server);

require('./helpers/db').default(mongoose, () => {

  parse(io);

  cron.schedule('* * 1 * * *', () => {
    console.log('running a task every hour');
    parse(io);
  });

});
require('./helpers/sockets').default(io);
require('./middlewares').default(app, express);
require('./routes').default(app);



// app.get('*', function(req, res){
//     console.log('sended');
//
//   res.sendFile(__dirname + '/build');
// });

app.use((req, res, next) => {

    // const store = createStore(req);
    // res.sendFile(__dirname + '/build');
    res.sendFile(path.join(__dirname, '/static/build/index.html'));

    // const content = renderer(req, store);
    // res.send(content);

  // const store = createStore(req);

  // const promises = matchRoutes(Routes, req.path)
  //   .map(({ route }) => {
  //     return route.loadData ? route.loadData(store) : null;
  //   });
    // .map(promise => {
    //   if (promise) {
    //     return new Promise((resolve, reject) => {
    //       promise.then(resolve).catch(resolve);
    //     });
    //   }
    // });

  // Promise.all(promises).then(() => {
  //   const context = {};
  //   const content = renderer(req, store, context);

    // if (context.url) {
    //   return res.redirect(301, context.url);
    // }
    // if (context.notFound) {
    //   res.status(404);
    // }

//     res.send(content);
//   });
});

// app.use('*', function(req, res) {
//   console.log('sended');
//   res.sendFile(__dirname + '/build');
// });
