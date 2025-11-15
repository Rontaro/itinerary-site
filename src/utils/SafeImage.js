import {Image} from "@chakra-ui/react";
import {useState} from "react";

export default function SafeImage({ src, alt, ...props }) {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <Image
            src={src}
            alt={alt}
            onError={() => setVisible(false)}
            {...props}
        />
    );
}