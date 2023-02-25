import cv2
import matplotlib.pyplot as plt

def pixelate(img, w, h, final_w, final_h):
    # curr_h, curr_w = img.shape[:2]
    # Resize input
    temp = cv2.resize(img, (w, h), interpolation=cv2.INTER_LINEAR)
    # Make output
    temp = cv2.resize(temp, (final_h, final_w), interpolation=cv2.INTER_NEAREST)
    return temp

def main():
    # Import image as OpenCV object
    img_file = "./assets/grainger.png"
    img = cv2.imread(img_file)
    pixelated = pixelate(img, 128, 128, 80, 192)
    plt.imshow(pixelated)
    plt.show()
        
if __name__ == "__main__":
    main()




