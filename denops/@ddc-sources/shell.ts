import { type Context, type Item } from "jsr:@shougo/ddc-vim@~9.1.0/types";
import { BaseSource } from "jsr:@shougo/ddc-vim@~9.1.0/source";

import type { Denops } from "jsr:@denops/core@~7.0.0";
import * as fn from "jsr:@denops/std@~7.4.0/function";
import * as op from "jsr:@denops/std@~7.4.0/option";
import * as vars from "jsr:@denops/std@~7.4.0/variable";

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
    let input = args.context.input;
    if (args.context.mode !== "c") {
      const filetype = await op.filetype.getLocal(args.denops);
      if (
        filetype === "deol" && await fn.exists(args.denops, "*deol#get_input")
      ) {
        input = await args.denops.call("deol#get_input") as string;
      }

      const uiName = await vars.b.get(args.denops, "ddt_ui_name", "");
      if (uiName.length > 0 && await fn.exists(args.denops, "*ddt#get_input")) {
        input = await args.denops.call("ddt#get_input", uiName) as string;
      }
    }

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
