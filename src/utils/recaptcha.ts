export const getRecaptchaToken = async () => {
  if (typeof window.grecaptcha === 'undefined') {
    return null
  }
  try {
    return window.grecaptcha.enterprise.execute(process.env.NEXT_PUBLIC_RECAPTCHA_KEY, {
      action: 'LOGIN',
    })
  } catch (err) {
    console.log('reCAPTCHA token generation failed with err', err)

    return null
  }
}
