import { Card } from "../../ui/card"
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Camera, Check, ImageIcon, Upload } from "lucide-react";
import { Button } from "../../ui/button";
import { useRef, useState, useEffect } from "react";

interface WastePhotoUploadProps {
  imageUploaded: File | null,
  setImageUploaded: (uploaded: File | null) => void,
  handleNextStep: () => void
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png"];



function WastePhotoUpload({ imageUploaded, setImageUploaded, handleNextStep }: WastePhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Create and cache object URL, revoke on cleanup
  useEffect(() => {
    if (!imageUploaded) {
      setImagePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageUploaded);
    setImagePreviewUrl(objectUrl);

    // Cleanup: revoke the object URL to prevent memory leaks
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageUploaded]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Unsupported file type. Please upload a JPG or PNG image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 10MB limit. Please upload a smaller image.");
      return;
    }

    setError(null)
    setImageUploaded(file)
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="p-8 w-full shadow-lg overflow-hidden">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold mb-2">
            Upload Waste Photo
          </h2>
          <p className="text-muted-foreground">
            Take or upload a photo of the waste you want to report
          </p>
        </div>

        <input
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg,image/png"
          type="file"
          onChange={handleFileChange}
        />

        <motion.div
          layout
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors duration-300 cursor-pointer hover:border-primary/50 hover:bg-primary/5 
            ${imageUploaded ? "border-primary bg-primary/5" : "border-border"}`}
          onClick={handleImageUpload}
          data-testid="upload-area"
        >
          <AnimatePresence mode="wait">
            {imageUploaded ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <div className="w-150 h-76 mx-auto rounded-xl overflow-hidden border bg-muted shadow-sm">
                  <img
                    src={imagePreviewUrl || ''}
                    alt="Uploaded waste"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-primary">Image uploaded successfully!</p>
                  <p className="text-sm text-muted-foreground text-wrap max-w-lg mx-auto">{imageUploaded.name}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="upload-prompt"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="space-y-10"
              >
                <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                  <ImageIcon className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium mb-1">Drop your image here, or click to browse</p>
                  <p className="text-sm text-muted-foreground">
                    Supports JPG, PNG up to 10MB
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageUpload();
                    }}
                    className="hover:cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                    <Upload className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                  <Button variant="outline" size="sm" className="hover:cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>


        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-destructive italic mt-2 text-center overflow-hidden"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex justify-end mt-8">
          <Button
            onClick={handleNextStep}
            disabled={!imageUploaded}
            data-testid="button-next"
            className="transition-all duration-300"
          >
            Next Step
            <ArrowRight className={`w-4 h-4 ml-2 transition-transform duration-300 ${imageUploaded ? "translate-x-1" : ""}`} />
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export default WastePhotoUpload
