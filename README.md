# ddc-source-shell

Shell completion for ddc.vim

This source collects items from `getcompletion()`. It is useful for shell
commands.

## Required

### denops.vim

https://github.com/vim-denops/denops.vim

### ddc.vim

https://github.com/Shougo/ddc.vim

## Configuration

```vim
call ddc#custom#patch_global('sources', ['shell'])

call ddc#custom#patch_global('sourceOptions', #{
      \   shell: #{
      \     mark: 'shell',
      \   }
      \ })
```
