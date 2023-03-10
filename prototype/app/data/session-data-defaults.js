/*

Provide default values for user session data. These are automatically added
via the `autoStoreData` middleware. Values will only be added to the
session if a value doesn't already exist. This may be useful for testing
journeys where users are returning or logging in to an existing application.

============================================================================

Example usage:

"full-name": "Sarah Philips",

"options-chosen": [ "foo", "bar" ]

============================================================================

*/

module.exports = {

    "role": "test",
    "owner-name": "test",
    "owner-unit": "test",
    "director-name": "Tom Gayler",
    "address": "101 Building Name, Street Name, Town",
    "flat number": "Flat 1",
    


}