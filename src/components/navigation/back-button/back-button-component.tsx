import { Button } from "@/components/common/button";
import InlineSVG from "@/components/inline-svg/inline-svg-component";
import { useRouter } from "next/navigation";


interface BackButtonProps {
    onClick?: () => void;
}


export default function BackButton({ onClick }: BackButtonProps) {

    const router = useRouter();

    const handleNavigateBack = () => {
        if (onClick) {
            onClick();
        } else {
            router.back();
        }
    }
    return (
        <Button variant="ghost" mode="link" onClick={handleNavigateBack} className="">
           <InlineSVG src="/icons/outlined/arrow-left-icon.svg" height={16} width={16} ariaHidden className="" />
            Back
        </Button>
    )
}