import { sleep } from './promise';

const SPLASH_SCREEN_ID = 'splash-screen';
const SPLASH_ANIMATION_DURATION = 200;

export async function hideSplashScreen() {
  const splashScreen = document.getElementById(SPLASH_SCREEN_ID);
  if (!splashScreen) return;

  // Animate splash screen away
  splashScreen.classList.add('splash-screen-hidden');

  // And properly remove it after the animation
  await sleep(SPLASH_ANIMATION_DURATION + 10);
  splashScreen.style.display = 'none';
}
