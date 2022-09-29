from IPython.core.magic import Magics, magics_class, line_magic, cell_magic, line_cell_magic


@magics_class
class KockpitMagics(Magics):

    # `@line_cell_magic` means that you can either use `%beep` for a single line 
    #   (which would be a little weird, tbh) or `%%beep` for a whole cell
    @line_cell_magic    
    def hello(self,line):
    if line == 'french':
        print("Salut tout le monde!")
    else:
        print("Hello world!")
        

def load_ipython_extension(ipython):
    ipython.register_magics(KockpitMagics)