import { type Context, type Item } from "jsr:@shougo/ddc-vim@~7.0.0/types";
import { BaseSource } from "jsr:@shougo/ddc-vim@~7.0.0/source";

import type { Denops } from "jsr:@denops/core@~7.0.0";
import * as fn from "jsr:@denops/std@~7.1.1/function";

type Params = Record<string, never>;

export class Source extends BaseSource<Params> {
  override isBytePos = true;

  override async getCompletePosition(args: {
    denops: Denops;
    context: Context;
  }): Promise<number> {
    const matchPos = await fn.match(
      args.denops,
      args.context.input,
      "\\f\\+$",
    ) as number;
    return Promise.resolve(matchPos);
  }

  override async gather(args: {
    denops: Denops;
    context: Context;
  }): Promise<Item[]> {
    const input = await fn.exists(args.denops, "*deol#get_input")
      ? await args.denops.call("deol#get_input") as string
      : args.context.input;

    let results: string[] = [];
    try {
      results = await fn.getcompletion(
        args.denops,
        "!" + input,
        "cmdline",
      ) as string[];
    } catch (_) {
      // Ignore errors
      //console.log(_);
    }

    return results.map((word) => {
      return { word };
    });
  }

  override params(): Params {
    return {};
  }
}
