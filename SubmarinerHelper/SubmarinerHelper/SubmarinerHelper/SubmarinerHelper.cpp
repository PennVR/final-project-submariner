#include <iostream>
#include <string>
#include <random>

using namespace std;

random_device rd;     // only used once to initialise (seed) engine
mt19937 rng(rd());    // random-number engine used (Mersenne-Twister in this case)
uniform_int_distribution<int> color_uni(0, 2); // guaranteed unbiased
uniform_int_distribution<int> depth_uni(20, 160);
uniform_int_distribution<int> direction_uni(0, 359);
uniform_int_distribution<int> time_uni(10, 30);

// A helper tool for task generation in C++.
// u_depth:_;l_depth:_;u_direction:_;l_direction:_;time:_;color:_;
int main() {
	string color;
	int color_select = color_uni(rng);
	if (color_select == 0) {
		color = "Red";
	} else if (color_select == 1) {
		color = "Blue";
	} else if (color_select == 2) {
		color = "Green";
	}

	int u_depth = depth_uni(rng);
	int l_depth = depth_uni(rng);
	if (u_depth < l_depth) {
		int temp = u_depth;
		u_depth = l_depth;
		l_depth = temp;
	}

	int u_direction = direction_uni(rng);
	int l_direction = direction_uni(rng);
	if (u_direction < l_direction) {
		int temp = u_direction;
		u_direction = l_direction;
		l_direction = temp;
	}

	cout << "u_depth:" << u_depth << ";l_depth:" << l_depth
		<< ";u_direction:" << u_direction << ";l_direction:" << l_direction
		<< ";time:" << time_uni(rng) << ";color:" << color << ";";
	return 0;
}