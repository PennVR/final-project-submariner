#include<iostream>
#include <random>

using namespace std;

random_device rd;     // only used once to initialise (seed) engine
mt19937 rng(rd());    // random-number engine used (Mersenne-Twister in this case)
uniform_int_distribution<int> uni(0, 1); // guaranteed unbiased

// A helepr tool for task generation in C++.
int main() {
	cout << "cb:" << uni(rng) << ";nl:" << uni(rng)
		 << ";gh:" << uni(rng) << ";ew:" << uni(rng);
	return 0;
}