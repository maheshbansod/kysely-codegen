#!/usr/bin/env node
import { Cli } from './cli.ts';

const args = Deno.args.slice(2);

void new Cli().run(args).then(() => Deno.exit(0));
