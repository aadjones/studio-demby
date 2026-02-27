////////////////////////////////////////////////////////////////////////////////
// Params
////////////////////////////////////////////////////////////////////////////////
unitsize(1cm);

int num_white = 4; // num_black will be num_white - 1

real white_aspect = 2.0; // width : height of white key
real black_aspect = white_aspect * 1.3; // width : height of white key
real black_to_white = 0.5; // legnth : length of black : white

pen thickness = 3+black;
pair origin = (0, 0);

////////////////////////////////////////////////////////////////////////////////
// Funcs
////////////////////////////////////////////////////////////////////////////////

// draw just the keyboard box
void draw_keyboard() {
  path white_key = box(origin, (white_aspect, 1));
  path black_key = scale(black_to_white) * box(origin, (black_aspect, 1));
  pair black_shift = (white_aspect - black_aspect * black_to_white, 1 - black_to_white / 2);
  
  // draw the keyboard
  for (int i = 0; i < num_white; ++i) {
    draw(shift(0, i) * white_key);
    if (i < num_white - 1) {
      filldraw(shift(black_shift) * shift(0, i) * black_key, black);
    }
  }
  
  // draw the top and bottom edges thicker
  path bottom = (origin--(white_aspect, 0));
  draw(bottom, thickness);
  draw(shift(0, num_white) * bottom, thickness);
}

// draw the attached semcircular body
void draw_body() {
  real radius = num_white / 2;
  pair center = (white_aspect, radius);
  path body = arc(center, radius, -90, 90)--cycle;
  draw(body, thickness);
  fill(body, black);
}

// put it all together
void draw_logo() {
  draw_keyboard();
  draw_body();
}

////////////////////////////////////////////////////////////////////////////////
// Scene
////////////////////////////////////////////////////////////////////////////////

draw_logo();
