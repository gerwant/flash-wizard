import sys

if __name__=="__main__":

    n = int(sys.argv[1])
    k = int(sys.argv[2])

    vector = [1 for x in range(n)]

    start = k-1

    while (sum(vector)>1):
        vector[start] = 0
        start+=k%n
        start = start%n

    print(vector.index(1))