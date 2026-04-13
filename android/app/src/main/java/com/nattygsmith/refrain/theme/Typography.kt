package com.nattygsmith.refrain.theme

import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import com.nattygsmith.refrain.R

/**
 * IM Fell English font family.
 *
 * TTF files must be placed in res/font/:
 *   im_fell_english_regular.ttf
 *   im_fell_english_italic.ttf
 *
 * Download from Google Fonts: https://fonts.google.com/specimen/IM+Fell+English
 * The same font files used in the web app (woff2) can be converted to TTF,
 * or downloaded directly from the Google Fonts repository.
 */
val ImFellEnglish = FontFamily(
    Font(R.font.im_fell_english_regular, FontWeight.Normal, FontStyle.Normal),
    Font(R.font.im_fell_english_italic,  FontWeight.Normal, FontStyle.Italic),
)
