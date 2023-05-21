import {
  BaseSource,
  Context,
  Item,
} from "https://deno.land/x/ddc_vim@v3.4.0/types.ts";
import { Denops, fn } from "https://deno.land/x/ddc_vim@v3.4.0/deps.ts";

type Params = Record<never, never>;

export class Source extends BaseSource<Params> {
  override getCompletePosition(args: {
    context: Context;
  }): Promise<number> {
    const matchPos = args.context.input.search(/\S+$/);
    const completePos = matchPos !== null ? matchPos : -1;
    return Promise.resolve(completePos);
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

    return results.map((word) => { return { word } });
  }

  override params(): Params {
    return {};
  }
}
