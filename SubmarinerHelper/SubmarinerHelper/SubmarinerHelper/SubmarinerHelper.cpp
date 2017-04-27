#include <iostream>
#include <string>
#include <random>

using namespace std;

random_device rd;     // only used once to initialise (seed) engine
mt19937 rng(rd());    // random-number engine used (Mersenne-Twister in this case)
uniform_int_distribution<int> color_uni(0, 2); // guaranteed unbiased
uniform_int_distribution<int> depth_uni(20, 140);
uniform_int_distribution<int> direction_uni(0, 339);
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

	int l_depth = depth_uni(rng);
	int u_depth = l_depth + 20;

	int l_direction = direction_uni(rng);
	int u_direction = u_direction + 20;

	cout << "u_depth:" << u_depth << ";l_depth:" << l_depth
		<< ";u_direction:" << u_direction << ";l_direction:" << l_direction
		<< ";time:" << time_uni(rng) << ";color:" << color << ";";
	return 0;
}