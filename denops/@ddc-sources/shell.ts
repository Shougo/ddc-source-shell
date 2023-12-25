import {
  BaseSource,
  Context,
  Item,
} from "https://deno.land/x/ddc_vim@v4.3.1/types.ts";
import { Denops, fn } from "https://deno.land/x/ddc_vim@v4.3.1/deps.ts";

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
