import cv2
import matplotlib.pyplot as plt

def tile(filename, img, h, w):
    img_h, img_w = img.shape[:2]
    # Sub is the size of each subimage
    sub_h = img_h//h
    sub_w = img_w//w

    print(sub_h)
    print(sub_w)

    counter = 0
    for i in range(h):
        for j in range(w):
            sub_img = img[(sub_h * i):(sub_h * (i+1)), (sub_w * j):(sub_w * (j+1))]
            cv2.imwrite(filename + str(counter) + ".png", sub_img)
            print("ehall" + str(counter))
            counter += 1

def main():
    # Import image as OpenCV object
    img_file = "./assets/art/ehall.png"
    img = cv2.imread(img_file, cv2.IMREAD_UNCHANGED)
    plt.imshow(img)
    plt.show()
    tile("../public/assets/tiles/ehall", img, 6, 9)
        
if __name__ == "__main__":
    main()




