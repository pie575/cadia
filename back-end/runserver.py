#----------------------------------------------------------------------
# runserver.py
# Author: Jackie, Tharun, Carter, Bofan
#----------------------------------------------------------------------

from firebase import get_score, post_score
from backend import chatgpt_response

#----------------------------------------------------------------------


def main():

    # Put server code here
    print(get_score(5))

if __name__ == '__main__':
    main()