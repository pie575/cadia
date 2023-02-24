#----------------------------------------------------------------------
# runserver.py
# Author: Jackie, Tharun, Carter, Bofan
#----------------------------------------------------------------------

import argparse
from sys import exit, stderr
from flaskr import init_app

#----------------------------------------------------------------------

def main():
    # Valid arguments for running reg.py with support for help
    parser = argparse.ArgumentParser(description =
    'The registrar application', allow_abbrev=False)
    parser.add_argument('port', type=int, help=
    'the port at which the server should listen')

    # parse_args() is needed to retrieve arguments
    args = vars(parser.parse_args())
    app = init_app()

    try:
        port = args['port']
        app.run(host='0.0.0.0', port=port, debug=True)

    except Exception as ex:
        # Errors here are due to port likely already in use
        # Print then Exit
        print(ex, file=stderr)
        exit(1)

if __name__ == '__main__':
    main()