<?php

require 'model/CountryVisit.php';
require 'model/CityVisit.php';
require 'model/PointVisit.php';
/*require 'model/City.php';
require 'model/Country.php';

Country::Load(
	json_decode(file_get_contents('originaldata/countries.json'))
);

City::Load(
	json_decode(file_get_contents('originaldata/cities.json'))
);*/

$data = json_decode(file_get_contents('originaldata/points.json'));

usort ( $data , function($a, $b) {
    if ($a->date == $b->date) {
        return 0;
    }
    return ($a->date < $b->date) ? -1 : 1;
});


$newdata = array();

$lastCountry = null;
$lastCity = null;
$obj = null;
$cityVisit = null;

foreach ($data as $item)
{
    if ($lastCountry != $item->country_id)
    {
    	//$country = Country::Get($item->country_id);

        echo "Country: {$item->country}\n";

		$countryVisit = new CountryVisit($item->country_id, $item->country);
		$newdata[] = $countryVisit;
        $lastCountry = $item->country_id;
    }

    if ($lastCity != $item->city_id)
    {
        if ($cityVisit)
        {
            $countryVisit->addCity($cityVisit);
        }

        //$city = City::Get($item->city_id);

        echo "\t City: {$item->city}\n";

		$cityVisit = new CityVisit($item->city_id, $item->city);
        $lastCity = $item->city_id;
    }

	$pointVisit = new PointVisit($item);
	$cityVisit->addPoint($pointVisit);

}

file_put_contents('generateddata/data.json', json_encode($newdata));

?>