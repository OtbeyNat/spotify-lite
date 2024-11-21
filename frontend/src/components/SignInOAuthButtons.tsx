import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

const SignInOAuthButtons = () => {
    const { signIn, isLoaded } = useSignIn();

    if (!isLoaded) {
        return null;
    }

    const signInWithSpotify = () => {
		signIn.authenticateWithRedirect({
			strategy: "oauth_spotify", // or oauth_google
			redirectUrl: "/sso-callback",
			redirectUrlComplete: "/auth-callback",
		});
	};

    return (
        <Button onClick={signInWithSpotify} variant={"secondary"} className='w-full text-white border-zinc-200 h-11'>
            <img src='/spotify.png' alt='Spotify' className='size-5' />
            {/* <img src='/google.png' alt='Google' className='size-5' /> */}
            Continue with Spotify
            {/* Continue with Google */}
        </Button>
    )
}

export default SignInOAuthButtons;