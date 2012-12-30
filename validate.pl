#!/usr/bin/perl

use WebService::Validator::HTML::W3C;
use common::sense;

sub validate_html()
{
    my $file = "wwii.html";
    my $v = WebService::Validator::HTML::W3C->new(
        detailed    =>  1
        );

    if ($v->validate_file($file)) {
        if ($v->is_valid) {
            printf("$file is valid\n");
            return 0;
        } else {
            printf("$file is not valid\n");
            foreach my $error (@{$v->errors}) {
                printf("%s at line %d\n", $error->msg,
                       $error->line);
            }
            return -1;
        }
    } else {
        printf("Failed to validate the file: %s\n", $v->validator_error);
        return -1;
    }
}

my $ret = 0;

$ret |= validate_html();

exit($ret);
